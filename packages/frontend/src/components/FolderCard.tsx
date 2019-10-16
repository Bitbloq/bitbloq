import React, { FC } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import folderImg from "../images/folder.svg";

export interface FolderCardProps {
  draggable?: boolean;
  folder: any;
  className?: string;
  onClick?: (e: React.MouseEvent) => any;
}

const FolderCard: FC<FolderCardProps> = ({
  draggable,
  folder,
  className,
  onClick,
  children
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "folder" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: monitor => {
      return !!draggable;
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["document", "folder"],
    drop: () => console.log("drop"),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <Container
      ref={drag}
      onClick={onClick}
      className={className}
      isDragging={isDragging}
      isOver={isOver}
    >
      <DropContainer ref={drop} />
      <Image src={folderImg} />
      <Info>
        <Title>{folder.name}</Title>
      </Info>
      {children}
    </Container>
  );
};

export default FolderCard;

interface ContainerProps {
  isDragging?: boolean | undefined;
  isOver?: boolean | undefined;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid
    ${(props: ContainerProps) =>
      props.isDragging || props.isOver ? colors.gray4 : colors.gray3};
  cursor: pointer;
  background-color: white;
  position: relative;
  visibility: ${(props: ContainerProps) =>
    props.isDragging ? "hidden" : "visible"};

  &:hover {
    border-color: ${colors.gray4};
  }
`;

const DropContainer = styled.div`
  background-color: rgba(0, 0, 0, 0);
  height: 100%;
  position: absolute;
  width: 100%;
`;

interface ImageProps {
  src: string;
}
const Image = styled.div<ImageProps>`
  flex: 1;
  background-color: ${colors.white};
  background-image: url(${props => props.src});
  background-size: 60px 60px;
  background-position: center;
  background-repeat: no-repeat;
  object-fit: contain;
  border-bottom: 1px solid ${colors.gray3};
`;

const Info = styled.div`
  padding: 14px;
  font-weight: 500;
  box-sizing: border-box;
  align-items: center;
  display: flex;
`;

const Title = styled.div`
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
`;
