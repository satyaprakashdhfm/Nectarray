## 🛠️ Maven - https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html 

### ✅ 1. What is Maven?

> **Apache Maven** is a build automation and project management tool for Java-based projects.

* **Manages**: Dependencies, builds, tests, packaging (JAR/WAR), and deployments.
* **File**: `pom.xml` (Project Object Model)

Maven Daemon (mvnd): Speeds up Maven builds by running in the background and reusing JVMs. 

Maven Wrapper (mvnw): Ensures your project uses a specific Maven version without requiring global installation. 

---

### ✅ 2. Maven Default Scope

> 🔹 The **default scope** in Maven is `compile`.

* It means dependencies are available **in all classpaths** (compile, test, runtime).
* You don't need to specify `scope=compile` explicitly.

---

### 🔁 3. Build Lifecycle Phases

| Phase        | Purpose                                         |
| ------------ | ----------------------------------------------- |
| validate     | Validate project is correct                     |
| compile      | Compile source code                             |
| test-compile | Compile test source                             |
| test         | Run unit tests (Surefire)                       |
| package      | Create JAR/WAR                                  |
| verify       | Integration tests / quality checks              |
| install      | Copy package to local repo (`~/.m2/repository`) |
| deploy       | Upload to remote repository                     |
| clean        | Delete `target/` directory                      |
| site         | Generate project site in `target/site/`         |

---

### 🚀 Common Commands (Lifecycle + Goals)

| Command               | Action                                    |
| --------------------- | ----------------------------------------- |
| `mvn clean install`   | Clean, compile, package & install locally |
| `mvn clean package`   | Clean & build package                     |
| `mvn clean deploy`    | Clean, build & upload to repo             |
| `mvn spring-boot:run` | Run Spring Boot application               |

---

### ⚙️ Dependency & Plugin Management

| Command                       | Description                    |
| ----------------------------- | ------------------------------ |
| `mvn dependency:tree`         | Show dependency hierarchy      |
| `mvn dependency:list`         | List all dependencies          |
| `mvn dependency:analyze`      | Show unused or undeclared deps |
| `mvn help:effective-pom`      | Show inherited/final pom.xml   |
| `mvn help:effective-settings` | Final `.m2/settings.xml` used  |

---

### 📦 Maven Project Structure

| Term       | Meaning                                 |
| ---------- | --------------------------------------- |
| groupId    | Organization name (e.g., `com.example`) |
| artifactId | Module/project name                     |
| version    | Version of the build (e.g., `1.0.0`)    |
| packaging  | Type: `jar`, `war`, `pom`, `ear`        |
| name       | Human-readable name                     |

---

### 📁 Project Types

| Type | Used For                  | Description                               |
| ---- | ------------------------- | ----------------------------------------- |
| JAR  | Spring Boot, CLI apps     | Executable, embedded server               |
| WAR  | Legacy web apps           | Deploys on external server (Tomcat/JBoss) |
| POM  | Parent aggregator project | Doesn't produce code, manages modules     |

---

### 🔌 Top Maven Plugins

| Plugin                   | Purpose                           |
| ------------------------ | --------------------------------- |
| maven-compiler-plugin    | Compile Java code                 |
| maven-surefire-plugin    | Run unit tests                    |
| maven-install-plugin     | Install in local Maven repo       |
| maven-deploy-plugin      | Deploy to remote Maven repo       |
| maven-clean-plugin       | Clean project (delete `/target`)  |
| spring-boot-maven-plugin | Run and repackage Spring Boot app |
| maven-site-plugin        | Generate documentation site       |

---

interface(type):  by default all methods in interface(class) are abstract methods. and we use implements(instead of extend) for subclass.Variables in interface are final and static

Anotations: meta data means we are telling my intention but if i make mistake compiler should tell like @override of method if not happend tell me. Rentention of like compiler level or runtime level.
    - class level 
    - variable level
    - method level

---
---

# **Spring**

A powerful Java framework for building enterprise applications using configuration of objects as beans(class is managed by spring where every object can be created without explicit mention) @bean and to manage them @component and dependency injection as conception in inversion control (ioc)


### Any anything from **[spring-data , spring-web, spring-security , spring-ai etc.....]** all these are made into usage only using spring-boot because of reduce in boiler plate if not code springe writing requries lots of configurations manually


### Spring:
- features:

1. **Spring Framework** – Core foundation of the Spring ecosystem. Includes modules like `spring-core`, `spring-context`, `spring-beans`, `spring-aop`, `spring-web`, and `spring-tx`.

> 2. **Spring Boot** – Auto-configuration framework for rapid application development. Popular starters include `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, and `spring-boot-devtools`.

3. **Spring Data** – Abstraction layer for database access. Key modules are `spring-data-jpa`, `spring-data-jdbc`, `spring-data-mongodb`, and `spring-data-rest`.

4. **Spring Security** – Security framework for authentication, authorization, and protection against common threats. Includes `spring-security-core`, `spring-security-oauth2`, `spring-security-jwt`, and `spring-security-web`.

5. **Spring Web** – Web capabilities for building MVC and reactive applications. Provides `spring-webmvc`, `spring-webflux`, `spring-websocket`, and `spring-messaging`.

6. **Spring Cloud** – Toolkit for building distributed systems and microservices. Includes modules like `spring-cloud-config`, `spring-cloud-gateway`, `spring-cloud-netflix`, and `spring-cloud-stream`.

7. **Spring Messaging** – Infrastructure for message-driven applications. Modules include `spring-jms`, `spring-amqp`, `spring-integration`, and `spring-messaging`.

8. **Spring Test** – Testing support for Spring apps. Includes `spring-test` and `spring-boot-starter-test`.

9. **Spring AI** – New AI integration layer to interact with LLMs. Modules include `spring-ai-openai-spring-boot-starter` and `spring-ai-huggingface-spring-boot-starter`.

 
 ---

# **Spring Boot**

An extension of Spring that simplifies application development by auto-configuring components and reducing boilerplate.
It allows quick setup of production-ready apps with embedded servers and minimal configuration.

> Spring Boot is a Java framework to build **production-grade, standalone apps** with **minimal configuration**.

* Built on **Spring Framework**
* Auto-configures everything
* Embedded servers: **Tomcat**, **Jetty**, **Undertow**


## **Spring Boot Starters**

✅ **Core Starters**

1. **spring-boot-starter** – Core Spring Boot support including auto-configuration, logging, YAML support.
2. **spring-boot-starter-logging** – Adds Logback as the default logging framework.
3. **spring-boot-starter-validation** – Enables Bean validation (JSR-380) using Hibernate Validator.
4. **spring-boot-starter-aop** – Support for aspect-oriented programming.
5. **spring-boot-starter-actuator** – Provides production-ready endpoints for monitoring (e.g., `/actuator/health`).

 🌐 **Web Development**

6. **spring-boot-starter-web** – Build web applications and REST APIs using Spring MVC.
7. **spring-boot-starter-webflux** – Build reactive web applications using Spring WebFlux.
8. **spring-boot-starter-thymeleaf** – Integrates Thymeleaf templating engine for rendering HTML views.
9. **spring-boot-starter-mustache** – Adds Mustache templating support.
10. **spring-boot-starter-tomcat** – Embedded Tomcat server (default).
11. **spring-boot-starter-jetty** – Use Jetty as the embedded servlet container.
12. **spring-boot-starter-undertow** – Use Undertow as the embedded server.

🛠️ **Data Access**

13. **spring-boot-starter-data-jpa** – Spring Data JPA and Hibernate integration for relational databases.
14. **spring-boot-starter-jdbc** – Basic JDBC support with Spring’s `JdbcTemplate`.
15. **spring-boot-starter-data-mongodb** – MongoDB support using Spring Data MongoDB.
16. **spring-boot-starter-data-redis** – Redis support with Spring Data Redis.
17. **spring-boot-starter-data-elasticsearch** – Elasticsearch search engine integration.
18. **spring-boot-starter-data-cassandra** – Cassandra NoSQL database integration.
19. **spring-boot-starter-data-neo4j** – Neo4j graph database support.

 🔒 **Security & Auth**

20. **spring-boot-starter-security** – Spring Security for authentication and authorization.
21. **spring-boot-starter-oauth2-client** – OAuth2 client support (e.g., Google, GitHub login).
22. **spring-boot-starter-oauth2-resource-server** – For creating secure OAuth2 resource APIs.

 📬 **Messaging**

23. **spring-boot-starter-amqp** – RabbitMQ messaging with Spring AMQP.
24. **spring-boot-starter-artemis** – Apache Artemis messaging support.
25. **spring-boot-starter-kafka** – Apache Kafka messaging support.
26. **spring-boot-starter-jms** – Java Messaging Service (JMS) support.

 ✉️ **Email & Integration**

27. **spring-boot-starter-mail** – Sending emails via JavaMail.
28. **spring-boot-starter-integration** – Spring Integration framework for messaging systems.

🧪 **Testing**

29. **spring-boot-starter-test** – JUnit, Mockito, AssertJ, Spring TestContext for unit and integration testing.



⏱️ **Batch & Scheduling**

30. **spring-boot-starter-batch** – Support for batch processing using Spring Batch.
31. **spring-boot-starter-quartz** – Scheduling support with Quartz Scheduler.

🏷️ **Spring Boot Annotations**

🔧 **Core Annotations**

1. **@SpringBootApplication** – Main annotation to enable Spring Boot auto-configuration, component scanning, and configuration.

2. **@ComponentScan** – Scans the package for Spring-managed components (`@Component`, `@Service`, `@Repository`, `@Controller`).

3. **@Configuration** – Marks a class as a source of Spring bean definitions (`@Bean` methods inside).

4. **@Bean** – Used to define a bean inside a `@Configuration` class.

5. **@Import** – Allows importing additional configuration classes.

6. **@PropertySource** – Loads properties file into Spring `Environment`.


🧩 **Stereotype Annotations**

7. **@Component** – Generic Spring-managed component.

8. **@Service** – Marks a service layer class (specialization of `@Component`).

9. **@Repository** – Indicates a DAO or repository class, adds exception translation.

10. **@Controller** – Marks a class as a Spring MVC controller.

11. **@RestController** – Combination of `@Controller` and `@ResponseBody`; returns JSON/XML responses.


🌐 **Web & REST Annotations**

12. **@RequestMapping** – Maps HTTP requests to handler methods or controllers.

13. **@GetMapping** – Shortcut for `@RequestMapping(method = GET)`.

14. **@PostMapping** – Shortcut for `@RequestMapping(method = POST)`.

15. **@PutMapping** – Shortcut for `@RequestMapping(method = PUT)`.

16. **@DeleteMapping** – Shortcut for `@RequestMapping(method = DELETE)`.

17. **@PatchMapping** – Shortcut for `@RequestMapping(method = PATCH)`.

18. **@PathVariable** – Binds a URI template variable to a method parameter.

19. **@RequestParam** – Extracts query parameters or form data.

20. **@RequestBody** – Maps HTTP request body to a Java object.

21. **@ResponseBody** – Indicates the return value should be serialized to the response body.

22. **@ResponseStatus** – Custom HTTP status code for controller methods.


🛡️ **Security & Validation**

23. **@Valid** – Triggers validation on method parameters or request bodies.

24. **@Validated** – Enables validation on a class level, supports validation groups.

25. **@PreAuthorize** – Method-level authorization using SpEL (e.g., roles).

26. **@Secured** – Limits access to a method to specific roles.

---

# configuration:
-  ✅ **Core Spring** does **not require** XML — but it **supports it**.

You can configure beans in **three ways** in core Spring:

| **Configuration Style**       | **Used In Core Spring?** | **Required?**  | **Example**                                  |
| ----------------------------- | ------------------------ | -------------- | -------------------------------------------- |
| 1. **XML-based**              | ✅ Yes                    | ❌ Not required | `beans.xml`, `<bean id="..." class="..."/>`  |
| 2. **Java-based (`@Config`)** | ✅ Yes (since Spring 3)   | ❌ Optional     | `@Configuration`, `@Bean` methods            |
| 3. **Annotation-based**       | ✅ Yes                    | ❌ Optional     | `@Component`, `@Autowired`, `@ComponentScan` |



So in short:
👉 **XML is optional in core Spring**, and has been **largely replaced** by annotations and Java-based config in modern apps.

Spring Boot **only uses annotation + Java config**, never XML by default.

Let me know if you want a side-by-side example of XML vs annotation config!

| **Section**                             | **Spring (with Annotations)**                                                                                    | **Spring Boot Enhancement (with Annotations)**                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **1. IoC Container and Beans**          | Use `@Component`, `@Service`, `@Repository`, and register config class with `AnnotationConfigApplicationContext` | Use `@SpringBootApplication` which includes `@ComponentScan`, `@Configuration`, and `@EnableAutoConfiguration` |
| **2. Container Overview**               | Manually create `ApplicationContext` from config class                                                           | Boot auto-creates context; main class runs `SpringApplication.run()`                                           |
| **3. Bean Overview**                    | Use `@Component`, `@Bean` in `@Configuration` class                                                              | Same annotations used; Boot auto-registers beans if in scanned package                                         |
| **4. Dependencies**                     | Use `@Autowired`, or constructor injection manually                                                              | Constructor injection auto-wired without `@Autowired`; `@Value` for config props                               |
| **5. Bean Scopes**                      | Use `@Scope("singleton")`, `@Scope("prototype")`, etc.                                                           | Same scope annotations supported directly                                                                      |
| **6. Customizing Beans**                | Use `@PostConstruct`, `@PreDestroy`, or `BeanPostProcessor`                                                      | Also supports `CommandLineRunner` and `ApplicationRunner` for startup logic                                    |
| **7. Bean Definition Inheritance**      | Use `<bean parent="..."/>` in XML (rarely done in annotation-based config)                                       | Not supported natively as XML-based config is discouraged                                                      |
| **8. Container Extension Points**       | Implement `ApplicationListener`, use `@Aspect`, etc.                                                             | Same, plus automatic registration of listeners defined as beans                                                |
| **9. Annotation-based Configuration**   | Use `@Component`, `@Autowired`, `@Configuration`                                                                 | Core to Spring Boot; auto-configures most of the infrastructure                                                |
| **10. Classpath Scanning**              | Use `@ComponentScan(basePackages = "...")`                                                                       | Boot auto-scans package of main class                                                                          |
| **11. JSR-330 Annotations**             | Use `@Inject`, `@Named`, `@Singleton` from `javax.inject`                                                        | Supported, but Spring annotations (`@Autowired`, `@Component`) preferred                                       |
| **12. Java-based Configuration**        | Use `@Configuration` and `@Bean` in config class                                                                 | Still used; Boot uses and enhances them with conditional and profile-based beans                               |
| **13. Environment Abstraction**         | Access with `Environment`, or use `@Value("${prop}")`                                                            | Uses `application.properties` / `application.yml`, supports profiles and `@ConfigurationProperties`            |
| **14. LoadTimeWeaver**                  | Configure in XML or programmatically                                                                             | Supported via starter + annotations if needed, but rarely used                                                 |
| **15. ApplicationContext Capabilities** | Manually use `ApplicationContext`, publish events, load resources                                                | Same, but Boot enhances with `@EventListener`, `ResourceLoader`, etc.                                          |
| **16. BeanFactory API**                 | Manually use `BeanFactory`, `getBean()`                                                                          | Boot uses `ApplicationContext` (BeanFactory under the hood), no need to use directly                           |

- generally methods are like :
    1. controller - managing http reqeustions
    2. service - main business logic
    3. repository -- database related

- dependency injections:
    1. field injection
    2. constructor injection
    3. setter injection

- annotation types:
    1. stereotype annotations
    2.

---
---

# Any web app:
1. data base
2. request response logic + aop
3. security

---
---

## 1. Data Base:
 
  1. Load the JDBC Driver
  2. Establish the Connection
  3. Create a Statement & Execute SQL Query
  4. Process the Result
  6. Close the Connection

- Statement vs Prepared Statement:
- what is resultset and what is the data type it returns? ResultSet is a JDBC **object** that holds the data returned by a SQL query, and it returns data in column-specific types like String, int, double, etc., using methods like getString(), getInt(), etc.



 🔍 JDBC vs ORM

| Feature            | **JDBC (No ORM)**                                          | **ORM (like JPA, Hibernate)**                                   |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Mapping            | Manual — you write code to map `ResultSet` rows to objects | Automatic — annotations or XML define how classes map to tables |
| SQL Handling       | You write raw SQL                                          | SQL is generated (you can customize if needed)                  |
| Code Complexity    | Higher — repetitive boilerplate code                       | Lower — focuses on domain logic                                 |
| Performance Tuning | Full control, but manual                                   | ORM provides lazy/eager loading, caching, batching, etc.        |
| Learning Curve     | Easier to start (simple use cases)                         | Steeper, but more powerful                                      |
| Transactions       | Manual with JDBC                                           | Declarative via `@Transactional` in Spring                      |

  🔧 JDBC Example (Manual Mapping)

```java
Connection con = DriverManager.getConnection(...);
Statement stmt = con.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users");

while (rs.next()) {
    User user = new User();
    user.setId(rs.getInt("id"));
    user.setName(rs.getString("name"));
    // map every field manually
}
```

🧠 ORM Example with JPA

```java
@Entity
public class User {
  @Id
  private int id;
  private String name;
}

User user = entityManager.find(User.class, 1);
```

---

**H2** – A lightweight Java SQL database that supports in-memory and file-based modes no external driver but uses internal, ideal for quick setups during development and testing.


---

### ORM : object relation mapping
- each class is an table(name)
- each parameter is table_column means it can be set with getter and setters.
- each object is a row....no:of records = no:of objects created.

### Hibernate:
- transaction
- sessionFactory
- configuration

{
    classname -> entityname -> tablename
}

📦 Database Access Layers in Java with Maven Dependencies

| **Technology**          | **Type**          | **Description**                                                                      | **DBC Type Used**                                              | **Maven Dependency**                                     |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------- |
| 🟡 **JDBC**             | Core Java API     | Low-level API to connect and run SQL queries using `Connection`, `Statement`.        | `java.sql.*`, `DataSource` (basic), no abstraction             | *(Built into JDK)*                                       |
| 🟢 **Spring JDBC**      | JDBC Wrapper      | Simplifies JDBC with `JdbcTemplate` and transaction support.                         | Uses `JdbcTemplate`, `DataSource`, Spring-managed transactions | `org.springframework.boot:spring-boot-starter-jdbc`      |
| 🟠 **Hibernate**        | ORM Framework     | Object-Relational Mapping (ORM) tool that maps Java objects to DB tables.            | JDBC internally, uses its own `SessionFactory`, `Transaction`  | `org.hibernate:hibernate-core`                           |
| 🟢 **Spring Boot**      | Framework         | Rapid Java app development; auto-configures DB access, often uses JPA or JDBC.       | `HikariCP`, Embedded DBs, `DataSource`, `JdbcTemplate`         | `org.springframework.boot:spring-boot-starter`           |
| 🔵 **Spring Data JPA**  | ORM + Spring Boot | Abstraction over Hibernate, uses interfaces like `JpaRepository` to simplify DB ops. | Built on Hibernate + JPA, auto-configured via Spring Boot      | `org.springframework.boot:spring-boot-starter-data-jpa`  |
| 🔷 **Spring Data REST** | RESTful API Layer | Auto-exposes JPA repositories as RESTful endpoints with minimal config.              | Built on Spring Data JPA and Spring Web                        | `org.springframework.boot:spring-boot-starter-data-rest` |

 

📌 Bonus Notes
* ✅ **Spring Boot with Spring Data JPA** is the most commonly used stack in production Java apps due to its simplicity, auto-configuration, and clean ORM support.
* Spring Boot supports **embedded databases** (H2, HSQLDB, Derby) for dev/testing.
* **JdbcTemplate** (Spring’s wrapper) simplifies JDBC code: manages connection, exceptions, etc.
* **HikariCP** is the default **connection pool** for production in Spring Boot.

---
---

## 2. weblogic + aop

### servlets and web:

- Tomcat:
    1.




- Spring web vs Spring boot web:

| Feature           | **Spring Web**               | **Spring Boot Web**                                      |
| ----------------- | ---------------------------- | -------------------------------------------------------- |
| Server            | External (manual config)     | Embedded (Tomcat default)                                |
| Configuration     | Manual (XML/Java config)     | Auto-configured based on classpath and properties        |
| JSON Support      | Manual Jackson setup         | Auto-configured JSON (Jackson by default)                |
| Error Handling    | Custom setup needed          | Auto error responses, customizable via properties        |
| Dev Experience    | Manual reload setup          | Spring Boot DevTools for hot reload, live templates      |
| REST API Ready    | Yes (more boilerplate)       | Yes, minimal setup (`@RestController`, `@SpringBootApp`) |
| Static Resources  | Needs mapping                | Auto-served from `/static`, `/public`, etc.              |
| Logging & Metrics | Manual setup                 | `spring-boot-starter-actuator` + auto logging setup      |
| Validation        | Manual validator integration | Auto-integrated Hibernate Validator                      |

### integer vs int:

1. Wrapper types (e.g. `Integer`) can be `null`, while primitives (`int`) cannot.
2. A `null` value lets you distinguish “no data” from a real zero or default.
3. JPA maps SQL `NULL` safely to wrapper fields, avoiding mismatches.
4. Validation annotations (like `@NotNull`, `@Min`) operate on object types, not primitives.
5. Using wrappers ensures consistency across entities, DTOs, and request handling.

### Comprehensive Spring Boot REST API Overview

 1. Core Annotations

| Annotation        | Layer     | Description                                         |
| ----------------- | --------- | --------------------------------------------------- |
| `@RestController` | Web       | Marks a class as a REST API controller              |
| `@Controller`     | Web (MVC) | Traditional MVC controller (returns views)          |
| `@RequestMapping` | Web       | Base URL or specific HTTP method mapping            |
| `@GetMapping`     | Web       | Shortcut for `@RequestMapping(method = GET)`        |
| `@PostMapping`    | Web       | Shortcut for `@RequestMapping(method = POST)`       |
| `@PutMapping`     | Web       | Shortcut for `@RequestMapping(method = PUT)`        |
| `@PatchMapping`   | Web       | Shortcut for `@RequestMapping(method = PATCH)`      |
| `@DeleteMapping`  | Web       | Shortcut for `@RequestMapping(method = DELETE)`     |
| `@PathVariable`   | Web       | Binds a method parameter to a URI template variable |
| `@RequestParam`   | Web       | Binds a method parameter to a query parameter       |
| `@RequestBody`    | Web       | Binds the HTTP request body to a method parameter   |
| `@ResponseStatus` | Web       | Sets the HTTP status code on exceptions or methods  |
| `@CrossOrigin`    | Web       | Configures CORS at class or method level            |

2. Dependency Injection

| Annotation                              | Use Case                                 |
| --------------------------------------- | ---------------------------------------- |
| `@Autowired`                            | Injects beans by type                    |
| `@Qualifier`                            | Selects a specific bean by name          |
| `@Value`                                | Injects values from properties           |
| `@Bean`                                 | Defines a bean in `@Configuration` class |
| `@Component`, `@Service`, `@Repository` | Stereotype annotations for scanning      |

3. Validation Annotations (JSR 380)

| Annotation         | Target                | Description                         |
| ------------------ | --------------------- | ----------------------------------- |
| `@Valid`           | Method parameter      | Triggers validation on DTO/entity   |
| `@NotNull`         | Field                 | Must not be `null`                  |
| `@NotBlank`        | `String` field        | Must contain non-whitespace content |
| `@Size`            | `String`/`Collection` | Size constraints (min, max)         |
| `@Min`             | Numeric field         | Minimum numeric value               |
| `@Max`             | Numeric field         | Maximum numeric value               |
| `@Email`           | `String` field        | Valid email format                  |
| `@Pattern`         | `String` field        | Matches a regex pattern             |
| `@Future`, `@Past` | `java.time` fields    | Date constraints                    |

4. Response Handling

* **`ResponseEntity<T>`**

  * Generic wrapper for full HTTP response: status, headers, and body.
  * Common static methods: `ok()`, `created()`, `noContent()`, `badRequest()`, `notFound()`, `status(HttpStatus)`.

* **Return Types**

  * `T` for single object
  * `List<T>` for collections
  * `Page<T>` for paginated results (via Spring Data)

5. Routing and Parameters

```java
@GetMapping("/users/{id}")
public ResponseEntity<User> getById(@PathVariable Long id) { ... }

@GetMapping("/search")
public List<User> search(
    @RequestParam(required = false) String name,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) { ... }
```

* **`@PathVariable`**: required by default, binds URI segments.
* **`@RequestParam`**: optional by default, configure `required`, `defaultValue`.
* **`@RequestHeader`**: binds HTTP headers.
* **`@CookieValue`**: binds cookie values.
* **`@MatrixVariable`**: binds matrix URI variables (disabled by default).

6. Error Handling

* **Controller-level**

  ```java
  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ErrorResponse handleNotFound(ResourceNotFoundException ex) { ... }
  ```

* **Global**

  ```java
  @ControllerAdvice
  public class GlobalExceptionHandler { ... }
  ```

* **Common HTTP Status Codes**

  | Code | Meaning               |
  | ---- | --------------------- |
  | 200  | OK                    |
  | 201  | Created               |
  | 204  | No Content            |
  | 400  | Bad Request           |
  | 401  | Unauthorized          |
  | 403  | Forbidden             |
  | 404  | Not Found             |
  | 409  | Conflict              |
  | 500  | Internal Server Error |

7. Data Access and Repositories

* **`JpaRepository<T, ID>`**: CRUD + paging/sorting.
* **`PagingAndSortingRepository<T, ID>`**: paging and sorting only.
* **`CrudRepository<T, ID>`**: basic CRUD only.
* **Custom Queries**: `@Query`, `@Modifying`, `nativeQuery=true`, `@Param`.

8. Transactions

| Annotation       | Description                                   |
| ---------------- | --------------------------------------------- |
| `@Transactional` | Manages transactions at method or class level |
| `readOnly=true`  | Optimizes for read-only operations            |
| `rollbackFor`    | Specifies exception types to trigger rollback |

9. Performance Considerations

* **Database Indexing**: add `@Index` on entity fields, use DDL scripts.
* **Connection Pooling**: HikariCP defaults; configure via `spring.datasource.hikari.*`.
* **Caching**: `@EnableCaching`, `@Cacheable`, `@CachePut`, `@CacheEvict`; integrate Redis or Ehcache.
* **Batch Processing**: `@BatchSize`, JDBC batch size, `JpaItemWriter` in Spring Batch.

 10. Monitoring & Documentation

* **Actuator**: `spring-boot-starter-actuator` for health, metrics, env, beans.
* **Swagger/OpenAPI**: `springdoc-openapi-ui` or `springfox` for auto-generated API docs.
* **Logging**: `Logback` or `Log4j2`; configure in `application.properties` or `logback.xml`.

## 3.security:

### 🛡️ Spring Security – Summary

**Spring Security** is a framework that provides comprehensive **security services** for **Java applications**, primarily for Spring-based apps. It handles **authentication**, **authorization**, **protection against common exploits**, and more.

  🔐 1. **Core Responsibilities**

| Responsibility       | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| **Authentication**   | Verifies *who* the user is (e.g., login with username/password).       |
| **Authorization**    | Controls *what* the user can access (based on roles/permissions).      |
| **Security Context** | Stores the current user's security info for the duration of a request. |

  🧱 2. **Main Components**

| Component                | Role                                                    |
| ------------------------ | ------------------------------------------------------- |
| `SecurityFilterChain`    | Intercepts HTTP requests and applies security logic.    |
| `AuthenticationManager`  | Manages and delegates authentication logic.             |
| `AuthenticationProvider` | Performs actual user validation.                        |
| `UserDetailsService`     | Loads user data (usually from a DB).                    |
| `PasswordEncoder`        | Encodes and verifies passwords securely (e.g., BCrypt). |
| `SecurityContextHolder`  | Stores security context (per request/thread).           |

  🔄 3. **Common Authentication Methods**

| Method               | Description                                |
| -------------------- | ------------------------------------------ |
| **Form-based login** | Traditional web login form.                |
| **HTTP Basic Auth**  | Username/password in HTTP headers.         |
| **JWT**              | Token-based stateless authentication.      |
| **OAuth2/OpenID**    | Login via Google, Facebook, GitHub, etc.   |
| **LDAP**             | Enterprise directory-based authentication. |

  🔧 4. **Annotations (Common Usage)**

| Annotation                         | Purpose                                       |
| ---------------------------------- | --------------------------------------------- |
| `@EnableWebSecurity`               | Enables Spring Security config.               |
| `@Configuration`                   | Declares a config class.                      |
| `@PreAuthorize` / `@PostAuthorize` | Secures methods based on roles or conditions. |
| `@Secured`                         | Allows role-based method-level security.      |

  🔁 5. **Security Filter Flow (Simplified)**

```
Client → Request → FilterChain → Authentication → SecurityContext
                                     ↓
                    Authenticated or Rejected
                                ↓
                        Access granted or denied
```

  ⚠️ 6. **Security Features**

* CSRF protection
* CORS configuration
* Session management
* HTTPS enforcement
* Role/authority checks
* Secure password handling
* Protection against:

  * Session fixation
  * Clickjacking
  * XSS
  * CSRF
  * Man-in-the-middle (with HTTPS)

 ✅ 7. **Best Practices**

* Use strong `PasswordEncoder` (e.g., `BCryptPasswordEncoder`)
* Secure all sensitive endpoints
* Minimize open `permitAll()` access
* Prefer JWT for stateless APIs
* Use HTTPS in production
* Apply **method-level security** for critical business logic

---
---

## MicroServices:
    
- cloud-ready vs cloud-native
