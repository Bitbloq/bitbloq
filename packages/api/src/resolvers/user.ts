import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { contextController } from "../controllers/context";
import { mailerController } from "../controllers/mailer";
import { DocumentModel, IDocument } from "../models/document";
import { ExerciseModel } from "../models/exercise";
import { FolderModel, IFolder } from "../models/folder";
import { SubmissionModel } from "../models/submission";
import { IUser, UserModel } from "../models/user";

import {
  IEmailData,
  IResetPasswordToken,
  ISignUpToken
} from "../models/interfaces";

import * as mjml2html from "mjml";
import { resetPasswordTemplate } from "../email/resetPasswordMail";
import { welcomeTemplate } from "../email/welcomeMail";

import { redisClient } from "../server";

const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const saltRounds = 7;

const userResolver = {
  Mutation: {
    // Public mutations:

    /**
     * Sign up user: register a new uer.
     * It sends a e-mail to activate the account and check if the registered account exists.
     * args: email, password and user information.
     */
    signUpUser: async (root: any, args: any) => {
      const contactFound: IUser = await UserModel.findOne({
        email: args.input.email
      });
      if (contactFound) {
        throw new ApolloError("This user already exists", "USER_EMAIL_EXISTS");
      }
      // Store the password with a hash
      const hash: string = await bcrypt.hash(args.input.password, saltRounds);
      const userNew: IUser = new UserModel({
        email: args.input.email,
        password: hash,
        name: args.input.name,
        center: args.input.center,
        active: false,
        authToken: " ",
        notifications: args.input.notifications,
        signUpSurvey: args.input.signUpSurvey,
        lastLogin: new Date(),
        teacher: true
      });
      const newUser: IUser = await UserModel.create(userNew);
      const token: string = jsonwebtoken.sign(
        {
          signUpUserID: newUser._id
        },
        process.env.JWT_SECRET
      );

      // Generate the email with the activation link and send it
      const data: IEmailData = {
        url: `${process.env.FRONTEND_URL}/app/activate?token=${token}`
      };
      const mjml: string = welcomeTemplate(data);
      const htmlMessage: any = mjml2html(mjml, {
        keepComments: false,
        beautify: true,
        minify: true
      });
      await mailerController.sendEmail(
        newUser.email,
        "Bitbloq Sign Up ✔",
        htmlMessage.html
      );

      // Create user root folder for documents
      const userFolder: IFolder = await FolderModel.create({
        name: "root",
        user: newUser._id
      });
      // Update the user information in the database
      await UserModel.findOneAndUpdate(
        { _id: newUser._id },
        { $set: { signUpToken: token, rootFolder: userFolder._id } },
        { new: true }
      );
      return "OK";
    },

    /*
      Login: login with a registered user.
      It returns the authorization token with user information.
      args: email and password.
    */
    login: async (root: any, { email, password }) => {
      const contactFound: IUser = await UserModel.findOne({ email });
      if (!contactFound) {
        throw new AuthenticationError("Email or password incorrect");
      }
      if (!contactFound.active) {
        throw new ApolloError(
          "Not active user, please activate your account",
          "NOT_ACTIVE_USER"
        );
      }
      // Compare passwords from request and database
      const valid: boolean = await bcrypt.compare(
        password,
        contactFound.password
      );
      if (valid) {
        const { token, role } = await contextController.generateLoginToken(
          contactFound
        );
        if (!contactFound.rootFolder) {
          const userDocs: IDocument[] = await DocumentModel.find({
            user: contactFound._id
          });
          const userFols: IFolder[] = await FolderModel.find({
            user: contactFound._id
          });
          const userFolder: IFolder = await FolderModel.create({
            name: "root",
            user: contactFound._id,
            documentsID: userDocs.map(i => i._id),
            foldersID: userFols.map(i => i._id)
          });
          await DocumentModel.updateMany(
            { user: contactFound._id },
            { $set: { folder: userFolder._id } }
          );
          await FolderModel.updateMany(
            { user: contactFound._id, name: { $ne: "root" } },
            { $set: { parent: userFolder._id } }
          );
          await UserModel.updateOne(
            { _id: contactFound._id },
            { $set: { rootFolder: userFolder._id } },
            { new: true }
          );
        }

        // Update the user information in the database
        await UserModel.updateOne(
          { _id: contactFound._id },
          { $set: { authToken: token, lastLogin: new Date() } },
          { new: true }
        );
        await storeTokenInRedis(`authToken-${contactFound._id}`, token);
        return token;
      } else {
        throw new AuthenticationError("Email or password incorrect");
      }
    },

    /*
     * renewToken: returns a new token for a logged user
     */
    renewToken: async (root: any, args: any, context: any) => {
      let oldToken = "";
      if (context.headers && context.headers.authorization) {
        oldToken = context.headers.authorization.split(" ")[1];
      }

      const { data, token } = await contextController.generateNewToken(
        oldToken
      );
      if (data.userID) {
        await storeTokenInRedis(`authToken-${data.userID}`, token);
      } else if (data.submissionID) {
        await storeTokenInRedis(`subToken-${data.submissionID}`, token);
      }
      return token;
    },

    /**
     * reset Password: send a email to the user email with a new token for edit the password.
     * args: email
     */
    resetPasswordEmail: async (root: any, { email }) => {
      const contactFound: IUser = await UserModel.findOne({ email });
      if (!contactFound) {
        throw new AuthenticationError("The email does not exist.");
      }
      const token: string = jsonwebtoken.sign(
        {
          resetPassUserID: contactFound._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      await storeTokenInRedis(`resetPasswordToken-${contactFound._id}`, token);

      // Generate the email with the activation link and send it
      const data: IEmailData = {
        url: `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      };
      const mjml = resetPasswordTemplate(data);
      const htmlMessage = mjml2html(mjml, {
        keepComments: false,
        beautify: true,
        minify: true
      });
      await mailerController.sendEmail(
        contactFound.email,
        "Cambiar contraseña Bitbloq",
        htmlMessage.html
      );
      return "OK";
    },

    checkResetPasswordToken: async (root: any, { token }) => {
      await getResetPasswordData(token);
      return true;
    },

    /**
     * edit Password: stores the new password passed as argument in the database
     * You can only use this method if the token provided is the one created in the resetPasswordEmail mutation
     * args: token, new Password
     */
    updatePassword: async (root: any, { token, newPassword }) => {
      const dataInToken = await getResetPasswordData(token);

      const contactFound: IUser = await UserModel.findOne({
        _id: dataInToken.resetPassUserID
      });

      if (!contactFound) {
        throw new ApolloError(
          "Error with reset password token",
          "USER_NOT_FOUND"
        );
      }
      // Store the password with a hash
      const hash: string = await bcrypt.hash(newPassword, saltRounds);
      const {
        token: authToken,
        role
      } = await contextController.generateLoginToken(contactFound);

      await UserModel.findOneAndUpdate(
        { _id: contactFound._id },
        {
          $set: {
            password: hash,
            authToken: authToken
          }
        }
      );

      if (process.env.USE_REDIS === "true") {
        redisClient.del(`resetPasswordToken-${contactFound._id}`);
      }

      await storeTokenInRedis(`authToken-${contactFound._id}`, authToken);
      return authToken;
    },

    /*
      Activate Account: activates the new account of the user registered.
      It takes the information of the token received and activates the account created before.
      args: sign up token. This token is provided in the email sent.
    */
    activateAccount: async (root: any, args: any, context: any) => {
      if (!args.token) {
        throw new ApolloError(
          "Error with sign up token, no token in args",
          "NOT_TOKEN_PROVIDED"
        );
      }
      const userInToken: ISignUpToken = await contextController.getDataInToken(
        args.token
      );

      const contactFound: IUser = await UserModel.findOne({
        _id: userInToken.signUpUserID
      });
      if (userInToken.signUpUserID && !contactFound.active) {
        const { token } = await contextController.generateLoginToken(
          contactFound
        );
        await UserModel.findOneAndUpdate(
          { _id: contactFound._id },
          {
            $set: {
              active: true,
              authToken: token,
              signUpToken: " "
            }
          }
        );
        await storeTokenInRedis(`authToken-${contactFound._id}`, token);
        return token;
      } else {
        return new ApolloError(
          "Error with sign up token, try again",
          "TOKEN_NOT_VALUE"
        );
      }
    },

    /**
     * Delete user: delete own user.
     * It deletes the user passed by the ID if it is the same as the passed by token.
     * This method deletes all the documents, exercises and submissions related with this user.
     * args: user ID.
     */
    deleteUser: async (root: any, args: any, context: any) => {
      const contactFound: IUser = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID
      });
      if (String(contactFound._id) === args.id) {
        await SubmissionModel.deleteMany({ user: contactFound._id });
        await ExerciseModel.deleteMany({ user: contactFound._id });
        await DocumentModel.deleteMany({ user: contactFound._id });
        await FolderModel.deleteMany({ user: contactFound._id });
        return UserModel.deleteOne({ _id: contactFound._id }); // Delete every data of the user
      } else {
        throw new ApolloError(
          "Can not delete a user that is not yours",
          "DELETE_USER_ERROR"
        );
      }
    },

    /*
      Update user: update existing user.
      It updates the user with the new information provided.
      args: user ID, new user information.
    */
    updateUser: async (root: any, args: any, context: any, input: any) => {
      const contactFound: IUser = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID
      });
      if (String(contactFound._id) === args.id) {
        const data: IUser = args.input;
        return await UserModel.findOneAndUpdate(
          { _id: contactFound._id },
          { $set: data },
          { new: true }
        );
      } else {
        return new ApolloError("User does not exist", "USER_NOT_FOUND");
      }
    }
  },

  Query: {
    /**
     *  Me: returns the information of the user provided in the authorization token.
     *  args: nothing.
     */
    me: async (root: any, args: any, context: any) => {
      const contactFound: IUser = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID
      });
      if (!contactFound) {
        return new ApolloError("Error with user in context", "USER_NOT_FOUND");
      }
      return contactFound;
    },

    /**
     *  Users: returns all the users in the platform. It can be executed only by admin user.
     *  args: nothing.
     */
    users(root: any, args: any, context: any) {
      return UserModel.find({});
    }
  },

  User: {
    documents: async (user: IUser) => DocumentModel.find({ user: user._id })
  }
};

const storeTokenInRedis = (id: string, token: string) => {
  if (process.env.USE_REDIS === "true") {
    return redisClient.set(String(id), token, (err, reply) => {
      if (err) {
        throw new ApolloError(
          "Error storing auth token in redis",
          "REDIS_TOKEN_ERROR"
        );
      }
    });
  }
};

const getResetPasswordData = async (token: string) => {
  if (!token) {
    throw new ApolloError(
      "Error with reset password token, no token in args",
      "INVALID_TOKEN"
    );
  }
  let dataInToken: IResetPasswordToken;

  try {
    dataInToken = await contextController.getDataInToken(token);
  } catch (e) {
    throw new ApolloError(
      "The provided token is not valid or has expired",
      "INVALID_TOKEN"
    );
  }

  if (process.env.USE_REDIS === "true") {
    const storedToken = await redisClient.getAsync(
      `resetPasswordToken-${dataInToken.resetPassUserID}`
    );
    if (storedToken !== token) {
      throw new ApolloError(
        "The provided token is not the latest one",
        "INVALID_TOKEN"
      );
    }
  }

  return dataInToken;
};

export default userResolver;
