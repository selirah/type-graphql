import { testDataSource } from "../datasource";
import { DataSource } from "typeorm";
import { Container } from "typedi";
import "reflect-metadata";

export const initializeDataSource = async (): Promise<DataSource> => {
  const dataSource = testDataSource(true);

  await dataSource
    .initialize()
    .then(() => Container.set(DataSource, dataSource));

  return dataSource;
};
