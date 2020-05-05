declare namespace NodeJS {
  export interface ProcessEnv {
    DB_DIALECT: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb'
  }
}
