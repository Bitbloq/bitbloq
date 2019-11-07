import React from "react";
import styled from "@emotion/styled";
import { colors, DropDown } from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import useLogout from "../lib/useLogout";
import MenuButton from "./MenuButton";

const UserSession = () => {
  const userData = useUserData();
  const logout = useLogout();

  return (
    <>
      <UserName>{userData && userData.name}</UserName>
      <UserAvatar src={userData ? userData.avatar : ""} />
      <DropDown>
        {(isOpen: boolean) => <MenuButton isOpen={isOpen} />}
        <ContextMenu>
          <ContextMenuOption onClick={() => logout()}>
            Cerrar sesión
          </ContextMenuOption>
        </ContextMenu>
      </DropDown>
    </>
  );
};

export default UserSession;

/* styled components */

const UserName = styled.div`
  font-size: 14px;
`;

interface ImageProps {
  src: string;
}

const UserAvatar = styled.div<ImageProps>`
  background-color: ${colors.grayAvatar};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

const ContextMenu = styled.div`
  background-color: white;
  margin-top: 6px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: solid 1px #cfcfcf;
`;

const ContextMenuOption = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1px solid #ebebeb;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 20px;

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }
`;
