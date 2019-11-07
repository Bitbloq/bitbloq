import { useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC } from "react";
import FilterOptions from "./FilterOptions";
import Paginator from "./Paginator";
import ResourceCard from "./ResourceCard";
import { OrderType } from "../config";
import { IResource } from "../types";

interface IResourcesListProps {
  currentPage: number;
  order: OrderType;
  pagesNumber: number;
  resources?: IResource[];
  searchText: string;
  selectResource: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setOrder: (order: OrderType) => void;
  setSearchText: (value: string) => void;
}

const ResourcesList: FC<IResourcesListProps> = ({
  currentPage,
  order,
  pagesNumber,
  resources = [],
  searchText,
  selectResource,
  setCurrentPage,
  setOrder,
  setSearchText
}) => {
  const t = useTranslate();

  return (
    <Container>
      <FilterContainer>
        <FilterOptions
          searchText={searchText}
          onChange={(value: string) => setSearchText(value)}
          onOrderChange={(order: OrderType) => setOrder(order)}
          selectValue={order}
        />
      </FilterContainer>
      {searchText && resources.length === 0 ? (
        <EmptyResources>{t("cloud.text.no-result")}</EmptyResources>
      ) : (
        <List>
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              {...resource}
              selectResource={selectResource}
            />
          ))}
        </List>
      )}
      {pagesNumber > 1 && (
        <Paginator
          currentPage={currentPage}
          pages={pagesNumber}
          selectPage={(page: number) => setCurrentPage(page)}
        />
      )}
    </Container>
  );
};

export default ResourcesList;

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: space-between;
  width: 100%;

  & > * {
    flex-shrink: 0;
  }
`;

const EmptyResources = styled.div`
  align-items: center;
  color: #373b44;
  display: flex;
  flex: 1;
  font-family: Roboto;
  font-size: 24px;
  font-weight: 300;
  justify-content: center;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const List = styled.div`
  display: grid;
  flex: 1;
  grid-auto-rows: 132px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 20px;
  margin: 20px 0;
`;