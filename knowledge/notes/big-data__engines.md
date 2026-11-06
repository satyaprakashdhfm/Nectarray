# MapReduce Engine (old Hadoop style)

- Batch-oriented, disk-heavy (each step writes to HDFS).

- High latency, slower (good for huge but not real-time jobs).

- Example: Counting words in a 1TB log → multiple map/shuffle/reduce steps, writing to disk between each.

# Spark Engine :

<img src="kb-media:279ce79ea19ad28290c2.png" alt="Alt Text" width="500"/>

1. **Local (single JVM)** — `local`, `local[n]`, `local[*]` — run everything on your laptop.
2. **Client vs Cluster deploy mode** — `--deploy-mode client|cluster` (where the driver runs).
3. **Standalone cluster** — Spark’s own master + workers (lightweight cluster).
4. **YARN** — run on Hadoop YARN (common on on-prem Hadoop clusters).
5. **Kubernetes** — executors & driver run as k8s pods (modern production).
6. **Mesos** — cluster manager (rare today).
7. **Interactive shells / notebooks** — `spark-shell`, `pyspark`, Jupyter/Zeppelin (REPL-style experimenting).
8. **Embedded (IDE / sbt / Metals)** — Spark runs inside your app JVM (good for debugging/tutorials).
9. **Cloud-managed** — Databricks, AWS EMR, Google Dataproc (managed clusters & production).

---

Got it — you want a **single compact Spark notes sheet** covering **RDDs, DataFrames, SQL, Streaming, MLlib, and GraphX** so it’s the whole Spark picture in one place.

Here’s the **small, precise, all-in-one** version:

---

## **Apache Spark Quick Notes (All APIs)**

### **1. RDD (Low-level API)**

* Immutable, distributed collections.
* **Create:** `sc.parallelize(list)`, `sc.textFile("path")`
* **Transformations:** `map`, `filter`, `flatMap`, `distinct`, `union`
* **Actions:** `collect`, `count`, `first`, `take(n)`, `saveAsTextFile`
* **Key-Value Ops:** `reduceByKey`, `mapValues`, `join`
* **Cache/Persist:** `cache()`, `persist()`

---

### **2. DataFrame (High-level API)**

* Tabular data with named columns.
* **Create:** `spark.read.csv("file")`, `spark.createDataFrame(data)`
* **Select & Filter:** `.select("col")`, `.filter("col > 10")`
* **Group & Aggregate:** `.groupBy("col").agg({"col2": "sum"})`
* **Write:** `.write.csv("path")`
* **SQL Support:** `df.createOrReplaceTempView("table")`

---

### **3. Spark SQL**

* Run SQL queries directly:

```python
spark.sql("SELECT col1, COUNT(*) FROM table GROUP BY col1")
```

* Integrates with DataFrames.

---

### **4. Structured Streaming**

* Real-time processing using DataFrames.
* **Source:** `.readStream.format("kafka")`, `.readStream.text("dir")`
* **Sink:** `.writeStream.format("console")`, `.writeStream.parquet("dir")`
* Always runs in micro-batches or continuous mode.

---

### **5. MLlib (Machine Learning)**

* Algorithms: classification, regression, clustering, recommendation.
* **Pipeline:**

  * Data → Feature transformers (`VectorAssembler`)
  * Estimator (`LogisticRegression`)
  * Evaluator (`MulticlassClassificationEvaluator`)
* Example:

```python
from pyspark.ml.classification import LogisticRegression
lr = LogisticRegression(featuresCol="features", labelCol="label")
model = lr.fit(df)
```

---

### **6. GraphX (Graphs in Spark — Scala/Java)**

* Graph processing library.
* Vertices + Edges RDDs.
* Algorithms: PageRank, Connected Components, Triangle Count.

---

✅ **Key Points to Remember:**

* **RDD** = low-level, flexible, more code.
* **DataFrame** = high-level, optimized, preferred for most work.
* **SQL API** = SQL syntax on DataFrames.
* **Structured Streaming** = real-time data with DataFrame API.
* **MLlib** = machine learning library.
* **GraphX** = graph analytics.

---

| Feature            | RDD (Low-Level API)                                                                          | DataFrame (High-Level API)                     | Spark SQL (Declarative API)                  |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| **Data Type**      | Distributed collection of objects                                                            | Distributed collection of rows with schema     | Structured data via SQL queries              |
| **Schema**         | No schema                                                                                    | Has schema                                     | Has schema                                   |
| **Ease of Use**    | Complex Scala/Python code                                                                    | API methods (select, filter, groupBy)          | SQL syntax                                   |
| **Performance**    | Slowest (no query optimization)                                                              | Optimized by Catalyst                          | Optimized + integrated with DataFrame engine |
| **Industry Usage** | Complex data preprocessing in ML pipelines (e.g., parsing raw logs, custom graph algorithms) | ETL jobs, feature engineering, batch analytics | BI dashboards, reporting, ad-hoc analytics   |
 

## - Spark RDD:
- rdd reading and writing a file
- deploying code to cluster:
    - Create RDD locally with `.master("local[*]")` and `spark.sparkContext.parallelize(data)`.
    - Deploy to cluster by changing `.master()` to cluster URL and running via `spark-submit --master <cluster-url> script.py`.

- common rdd tranformations and actions
- pair rdd
- using schema rdd
- using row rdd
- rdd tuning:
    | Tuning Aspect           | What it Controls                    | How to Set in RDD                                                                      | Industry-Level Practice                                          | Limits / Risks                                     |
    | ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
    | **Partitions**          | Number of RDD splits across cluster | `minPartitions`, `.repartition()`, `.coalesce()`                                       | `2–4 × total CPU cores` for balanced load                        | Too many → scheduler overhead; too few → idle CPUs |
    | **Persistence Level**   | How RDD is cached in memory/disk    | `.persist(StorageLevel.MEMORY_ONLY)`                                                   | Use memory-only for iterative ML; use memory+disk for large RDDs | Memory pressure → GC pauses / spilling             |
    | **Serialization**       | Data encoding format                | `spark.serializer=KryoSerializer`                                                      | Kryo for faster, smaller shuffle                                 | Incompatible if not registered                     |
    | **Shuffle Parallelism** | Parallelism in wide transformations | `spark.sql.shuffle.partitions` (for DataFrame) or `reduceByKey(numPartitions)` for RDD | Match to partition count to avoid skew                           | Too low → stragglers; too high → shuffle overhead  |
    | **Cluster Resources**   | CPU & memory allocation             | `--executor-memory`, `--executor-cores`                                                | Right-size to dataset & job pattern                              | Over-allocation → wasted nodes; under → slow jobs  |

## - spark DataFrames:
- creating dataframes seamlessly and form rdd
- reading and writing avro data , xml data...default parquet format
