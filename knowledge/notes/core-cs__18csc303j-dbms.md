# DBMS & Database Services Reference Guide

**1. Database Service Types**
- **Managed SQL Services**: RDS, Azure SQL Database, Google Cloud SQL
  - MySQL: Open-source database ideal for web applications
  - PostgreSQL: Advanced features with high extensibility and standards compliance
  - Oracle Database: Enterprise-grade with PL/SQL programming capabilities
  - SQL Server: Microsoft ecosystem integration with T-SQL
  - SQLite: Lightweight, embedded database for local applications
- **NoSQL Database Services**
  - Document databases: MongoDB, CouchDB for JSON-like documents
  - Key-Value databases: Redis, DynamoDB, Memcached for simple lookup operations
  - Wide-Column databases: Cassandra, HBase for time-series and IoT data
  - Graph databases: Neo4j, Amazon Neptune for relationship-heavy data

**2. Specialized Database Systems**
- **Time-Series Databases**: InfluxDB, TimescaleDB for time-stamped data
- **In-Memory Databases**: Redis, Memcached for caching and real-time applications
- **Vector Databases**: Pinecone, FAISS, Weaviate for AI/ML embeddings and semantic search
- **Search Engines**: Elasticsearch, Solr for full-text search capabilities

**3. Data Architecture Patterns**
- **Database Architecture**: **Database = Storage Engine (InnoDB, WiredTiger) + Query Processor + Transaction Manager + Buffer Pool**
	- Traditional databases are *complete systems* with tightly coupled storage and compute, unlike lakes where they're separate.

- **Data Warehouse Architecture**: **Data Warehouse = Columnar Storage + MPP Query Engine + ETL Pipeline + Metadata Layer**
	- Examples: Snowflake = Cloud Storage + Virtual Warehouses, BigQuery = Colossus + Dremel engine.

- **Data Mart Architecture**: **Data Mart = Subset of DW Data + Department-Specific Schema + Optimized Indexes + Access Controls**
	- It's essentially a *filtered view* of the warehouse, not separate infrastructure.

- **ETL Architecture**: **ETL = Staging Area + Transform Engine (Informatica, SSIS) + Target Load**
	- Data is transformed *before* loading, requiring separate compute resources for transformation.

- **ELT Architecture**: **ELT = Raw Load + In-Database Transform (dbt, Spark SQL) + Target Schema**
	- ELT leverages the *target system's compute* instead of separate transformation servers.

- **Stream Processing Architecture**: **Stream Processing = Message Broker (Kafka) + Stream Engine (Flink, Kafka Streams) + State Store + Sink**
	- The *message broker* provides durability, the *engine* provides computation logic.

- **OLTP Architecture**: **OLTP = Row Storage + B-Tree Indexes + ACID Transactions + Connection Pooling**
	- OLTP optimizes for *single-row operations* with fast writes and consistent reads.

- **OLAP Architecture**: **OLAP = Columnar Storage + Bitmap Indexes + Parallel Query + Aggregation Cache**
	- OLAP optimizes for *bulk analytical scans* across millions of rows.

- **Data Catalog Architecture**: **Data Catalog = Metadata Repository + Crawler/Scanner + Search Index + Lineage Graph + UI**
	- The *crawlers* discover assets, the *graph* tracks relationships, UI provides discovery interface.

**5. Database Design Fundamentals**
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability
- **Schema Design**: Proper normalization to reduce redundancy
- **Key Management**: Primary keys for unique identification, foreign keys for referential integrity
- **Performance Optimization**: Indexing strategies and query optimization
- **Data Integrity**: Constraints for validation and consistency

**6. Big Data & Analytics Services**
- **Data Warehousing**: Large-scale analytics solutions
- **ETL/ELT Tools**: Data transformation and loading pipelines
- **Real-time Analytics**: Streaming analytics platforms
- **Data Catalog**: Metadata management services
- **Business Intelligence**: Visualization and reporting tools
- **Distributed Computing**: Spark and Hadoop frameworks for big data processing

---
---

project1: frames&more:

- Session parameters / runtime configuration settings. - Useful after creation? ❌ Not really, unless you explicitly configure them globally like you put them in `postgresql.conf` or set them with ALTER DATABASE … SET

- Enums : predefined allowed values type.- Importance after use = guarantees long-term data consistency across the database and applications.-Compact & Fast – stored internally as integers, faster than text for comparisons.

- CREATE INDEX = build a fast lookup path on a column.Indexes improve read performance, but slow down writes (INSERT/UPDATE/DELETE), since the index must be updated too.You don’t need indexes on every column — only on columns frequently used in WHERE, JOIN, ORDER BY, GROUP BY.Internally, PostgreSQL usually builds a B-tree structure for fast lookups.

- Schema : A schema is like a **folder** (namespace). There can be multiple schemas in a single database and they can be inter used In PostgreSQL, it can contain:
    1. **Tables** – main data storage.
    2. **Views** – saved queries (virtual tables).
    3. **Indexes** – speed up table queries.
    4. **Constraints** – rules inside tables (PK, FK, UNIQUE, CHECK).
    5. **Sequences** – counters for IDs.
    6. **Functions & Procedures** – reusable business logic.
    7. **Triggers** – actions that run automatically on table events (e.g., `BEFORE INSERT`).
    8. **Types** – custom data types (e.g., `ENUM`).
    9. **Operators** – custom operators.
    10. **Extensions** – optional features (like `uuid-ossp` for UUIDs).

- structure of databases:
    1. **Database Server Group** *(pgAdmin concept, not PostgreSQL itself)*
        * Just a way to organize multiple servers in pgAdmin.

    2. **Database Server (Cluster)**

        * One running PostgreSQL instance.
        * Can host **multiple databases**.

    3. **Database**

        * A single database inside the server.
        * Independent from other databases (no cross-table queries without special tools like `dblink`).

    4. **Schemas**

        * Namespaces inside a database.
        * Group related objects (tables, views, functions, etc.).

    5. **Tables**

        * Hold structured data.
        * Defined by **columns** (attributes).

    6. **Rows**

        * Individual records in a table.

    7. **Columns**

        * Fields of each row, with defined data types (`INT`, `VARCHAR`, `ENUM`, etc.).

- **Extension**: Enables bcrypt extension: `CREATE EXTENSION IF NOT EXISTS pgcrypto` adds cryptographic functions to PostgreSQL
- Password hashing: `crypt('Admin@123', gen_salt('bf'))` uses bcrypt algorithm to hash the password to insert a record if a bcrypt being used in the code.
- important plsql property : row level security(rls) , using policy for a table :
    - Policies are table-specific - each policy applies to one table
    - Schemas organize tables - but don't directly contain policies
    - Multiple policies per table - you can have many policies on one table
    - Policies use functions/expressions - they reference database functions, user roles, etc.
