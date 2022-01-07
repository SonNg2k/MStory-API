# TypeORM Notes

```typescript
class Project { ... 
  	@JoinColumn() // Denotes that the following column is the owner side, which will be added to the 'projects' table. Each project doc points to the user who created it in unidirectional way. The column will be suffixed with the keyword 'Id'. Same thing to JoinTable
		creator: User 	// generated column: creatorId
    // Source: https://github.com/typeorm/typeorm/issues/794. 
}
```

Query builder syntax to join tables is terrible. In some cases, it generates the correct SQL queries (tested in DataGrip) but fails to read the returned result in native NodeJS environment

It's best to use an ORM that can log its own generated raw SQLs (help for analysis of performance) and allows us to write our own raw SQL queries (query builders would be awesome!)

Research the Regex in helpers, error handler, and constants
