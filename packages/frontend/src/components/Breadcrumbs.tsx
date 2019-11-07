import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import styled from "@emotion/styled";

import { colors, DropDown, Icon, useTranslate } from "@bitbloq/ui";
import FolderSelectorMenu from "./FolderSelectorMenu";

export interface BreadcrumbLink {
  route?: string;
  text: string;
  type: "folder" | "document";
}

export interface BreadcrumbsProps {
  links: BreadcrumbLink[];
  title?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links, title }) => {
  const t = useTranslate();

  const breadcrumbTarget = useRef<HTMLLIElement>(null);
  const breadcrumbTargetParent = useRef<HTMLDivElement>(null);

  const [customLinks, setLinks] = useState([links[0]]);
  const [hideFolders, setHideFolders] = useState<BreadcrumbLink[]>([]);
  const [maxWidth, setMaxWidth] = useState(0);

  const setElementMaxWidth = (): void => {
    const element = breadcrumbTarget.current as HTMLLIElement;
    const parentElement = breadcrumbTargetParent.current as HTMLDivElement;

    if (element && breadcrumbTargetParent) {
      const elementLeft = element.offsetLeft;
      const parentLeft = parentElement.offsetLeft;
      const parentWidth = parentElement.offsetWidth;

      const maxWidth = parentLeft + parentWidth - elementLeft;
      setMaxWidth(maxWidth);
    }
  };

  useEffect(() => {
    setElementMaxWidth();
    window.addEventListener("resize", setElementMaxWidth);

    return () => window.removeEventListener("resize", setElementMaxWidth);
  });

  useEffect(() => {
    let customLinks: BreadcrumbLink[];
    let hideLinks: BreadcrumbLink[];
    if (links.length > 4) {
      customLinks = links.slice(links.length - 3);
      hideLinks = links.slice(1, links.length - 3);
    } else {
      customLinks = links.slice(1);
      hideLinks = [];
    }
    setHideFolders(hideLinks);
    setLinks(customLinks);
  }, []);

  return (
    <Wrap>
      <Links aria-label="Migas de pan">
        <BreadcrumbRoot>
          <a href={(links && links[0].route) || ""}>{t("breadcrumbs-root")}</a>
        </BreadcrumbRoot>
        {hideFolders.length > 0 ? (
          <>
            <Separator name="angle" />
            <DropDown
              attachmentPosition="top left"
              targetPosition="bottom left"
              offset="-6px 0"
            >
              {(isOpen: boolean) => (
                <FoldersMenu isOpen={isOpen}>
                  <Icon name="ellipsis" />
                </FoldersMenu>
              )}
              <FolderSelectorOptions>
                {hideFolders.map((folder, index) => (
                  <FolderSelectorOption key={index} href={folder.route}>
                    <MenuIcon name="folder-icon" />
                    <p>{folder.text}</p>
                  </FolderSelectorOption>
                ))}
              </FolderSelectorOptions>
            </DropDown>
          </>
        ) : (
          <></>
        )}
        <BreadcrumbsNoRoot
          isThereHidden={hideFolders.length > 0}
          ref={breadcrumbTargetParent}
        >
          {customLinks &&
            customLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Separator name="angle" />
                {index === customLinks.length - 1 ? (
                  <BreadcrumbTarget ref={breadcrumbTarget} maxWidth={maxWidth}>
                    <IconLink
                      name={
                        link.type === "document" ? "document" : "folder-icon"
                      }
                    />
                    <p>{title || link.text}</p>
                  </BreadcrumbTarget>
                ) : (
                  <BreadcrumbLink folders={links.length - 2}>
                    <IconLink name="folder-icon" />
                    <a href={link.route || ""}>{link.text}</a>
                  </BreadcrumbLink>
                )}
              </React.Fragment>
            ))}
        </BreadcrumbsNoRoot>
      </Links>
    </Wrap>
  );
};

export default Breadcrumbs;

const Breadcrumb = styled.li`
  align-items: center;
  color: #373b44;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;

  a,
  p {
    margin: 0;
    overflow: hidden;
    padding-right: 2px;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface BreadcrumbLinkProps {
  folders: number;
}
const BreadcrumbLink = styled(Breadcrumb)<BreadcrumbLinkProps>`
  max-width: ${props =>
    props.folders === 1 ? "50" : props.folders === 2 ? "30" : "25"}%;
  font-weight: bold;

  a {
    height: 16px;
    padding: 0;
  }
`;

const BreadcrumbRoot = styled(Breadcrumb)`
  flex: 0 0;
  font-weight: bold;
`;

interface BreadcrumbsNoRootProps {
  isThereHidden: boolean;
}
const BreadcrumbsNoRoot = styled.div<BreadcrumbsNoRootProps>`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-start;
  width: calc(100% - 110px - ${props => (props.isThereHidden ? 65 : 0)}px);
`;

interface BreadcrumbTargetProps {
  maxWidth: number;
}
const BreadcrumbTarget = styled(Breadcrumb)<BreadcrumbTargetProps>`
  max-width: ${props => props.maxWidth}px;

  p {
    height: 16px;
    padding: 0;
  }
`;

interface FoldersMenuProps {
  isOpen: boolean;
}
const FoldersMenu = styled.div<FoldersMenuProps>`
  align-items: center;
  background-color: ${props => (props.isOpen ? "#e8e8e8" : "#fff")};
  border: solid 1px #dddddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 34px;
  justify-content: center;
  width: 34px;

  &:hover {
    background-color: #e8e8e8;
  }

  svg {
    height: 14px;
    width: 14px;
  }
`;

const FolderSelectorOption = styled.a`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  display: flex;
  height: 35px;
  padding: 0 14px 0 13px;
  text-decoration: none;

  p {
    color: #3b3e45;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color: #ebebeb;
  }
`;

const FolderSelectorOptions = styled.div`
  background-color: white;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  max-height: 303px;
  max-width: 849px;
  overflow: scroll;

  &:hover {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const IconLink = styled(Icon)`
  flex-shrink: 0;
  margin-right: 6px;
  height: 20px;
  width: 20px;
`;

const Links = styled.ul`
  align-items: center;
  display: flex;
  font-size: 16px;
  height: 100%;
  justify-content: flex-start;
  width: 100%;
`;

const MenuIcon = styled(Icon)`
  flex-shrink: 0;
  height: 13px;
  margin-right: 14px;
  width: 13px;
`;

const Separator = styled(Icon)`
  flex-shrink: 0;
  height: 13px;
  margin: 10px;
  transform: rotate(-90deg);
  width: 13px;
`;

const Wrap = styled.nav`
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: flex-start;
  overflow: hidden;
  width: 100%;
`;
