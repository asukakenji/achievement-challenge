# BNF Grammar for Match Expression

```
                       <match-expression> ::= '{' <match-expression-element-list> '}'

          <match-expression-element-list> ::= <empty>
                                            | <non-empty-match-expression-element-list>

<non-empty-match-expression-element-list> ::= <match-expression-element>
                                            | <match-expression-element> ',' <non-empty-match-expression-element-list>

               <match-expression-element> ::= <name> ':' <sub-or-value>
                                            | <logical-operator> ':' <non-empty-match-expression-array>

                           <sub-or-value> ::= <sub>
                                            | <value>

                                    <sub> ::= '{' <non-empty-sub-field-list> '}'

               <non-empty-sub-field-list> ::= <sub-field>
                                            | <sub-field> ',' <non-empty-sub-field-list>

                              <sub-field> ::= <comparison-operator> ':' <value>

                    <comparison-operator> ::= <eq-operator>
                                            | <gt-operator>
                                            | <gte-operator>
                                            | <lt-operator>
                                            | <lte-operator>
                                            | <ne-operator>

                       <logical-operator> ::= <and-operator>
                                            | <or-operator>

       <non-empty-match-expression-array> ::= '[' <non-empty-match-expression-list> ']'

        <non-empty-match-expression-list> ::= <match-expression>
                                            | <match-expression> ',' <non-empty-match-expression-list>

                            <eq-operator> ::= '"$eq"'
                            <gt-operator> ::= '"$gt"'
                           <gte-operator> ::= '"$gte"'
                            <lt-operator> ::= '"$lt"'
                           <lte-operator> ::= '"$lte"'
                            <ne-operator> ::= '"$ne"'

                           <and-operator> ::= '"$and"'
                            <or-operator> ::= '"$or"'

                                   <name> ::= <json-string>
                                  <value> ::= <json-value>
                                  <empty> ::=
```

# Grammar Examples

Match Expression:
```json
{
  "x": {
    "$gt": 1,
    "$lt": 2
  },
  "y": {
    "$gt": 3,
    "$lt": 4
  },
  "$or": [
    {
      "z1": 5
    },
    {
      "z2": 6
    }
  ]
}
```

* * *

Match Expression Element:
```json
{
  "x": {
    "$gt": 1,
    "$lt": 2
  }
}
```

Field Name (`e.fieldName()` / `name`):
```json
"x"
```

Sub (`e.Obj()` / `_parseSub()` / `sub`):
```json
{
  "$gt": 1,
  "$lt": 2
}
```

Sub-Field:
```json
"$gt": 1
```

* * *

Match Expression Element:
```json
{
  "$or": [
    {
      "z1": 5
    },
    {
      "z2": 6
    }
  ]
}
```

Field Name (`e.fieldName()`):
```json
"$or"
```

Object (`e.Obj()` / `_parseTreeList()` / `arr`):
```json
[
  {
    "z1": 5
  },
  {
    "z2": 6
  }
]
```

The names of grammatical constructs follow the origin naming in MongoDB.

See:
- [expression_parser.cpp](https://github.com/mongodb/mongo/blob/master/src/mongo/db/matcher/expression_parser.cpp)
- [canonical_query.cpp](https://github.com/mongodb/mongo/blob/master/src/mongo/db/query/canonical_query.cpp)
