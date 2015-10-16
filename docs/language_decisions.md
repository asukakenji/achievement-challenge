# Language Decisions



### C#

##### Pros

- C# has a much more expressive syntax than Java.
  - Delegates since C# 1.0.
  - Anonymous methods since C# 2.0.
  - Iterators (`yield`) since C# 2.0.
  - Partial class since C# 2.0.
  - LINQ since C# 2.0.
  - Lambda expressions since C# 3.0.
  - Generic co-variance and contra-variance since C# 4.0.
  - Dynamic types since C# 4.0.

##### Cons

- I do not use Windows (and of course, Visual Studio).
  - Although Mono is an alternative, compatibility issues are expected.

- It has been a long time since the last time I wrote C# for serious reasons.
  - I need some time for revisions before starting.

- C# uses strong, static typing, which may affect extensibility.
  - Dynamic typing was introduced since C# 4.0.
    - But I am not sure this feature was well developed.
  - Besides, Mono may not support it completely.

- I have no experience in server side C# programming without ASP .NET.
  - However, using ASP .NET together may involve a bigger setup.
  - Again, Mono may not support it.

- Although packages could be found at NuGet, it is relatively immature.

* * *

### Java

##### Pros

- Java is my most proficient programming language.

- Java has a pretty expressive syntax.
  - Generics since J2SE 5.0.
  - Lambda expressions since Java SE 8.

- Tons of packages could be found at Maven.

##### Cons

- Java uses strong, static typing, which may affect extensibility.
  - Java does not have a variant type (unified primitive and reference type).
    - Numbers are forced to be boxed.

- Using only Java SE to code the challenge is tedious.

- Using Java EE to code the challenge requires a lot of setups.
  - Lots of XML files are required.
  - Coding in Java EE is virtually impossible without an IDE (like Eclipse)

* * *

### JavaScript (Node.js)

##### Pros

- JavaScript has a pretty expressive syntax.
  - Anonymous functions since the beginning.
  - Arrow functions since ECMAScript 6.
  - Generator functions (`function*`, `yield`, `yield*`) since ECMAScript 6.
  - Promises since ECMAScript 6.

- Asynchronous programming is in the heart of JavaScript / Node.js
  - Callbacks are used throughout the core APIs

- JavaScript uses dynamic, duck typing, which is excellent for extensibility.

- JSON is natively supported.
  - JSON stands for JavaScript Object Notation, or "Son of JavaScript" in the original draft.

- Tons of packages could be found at npm.

- Node.js scripts are clean, easy to understand.
  - ```npm``` handles all the setups required.

- MongoDB supports JavaScript natively.

##### Cons

- It has been a long time since the last time I wrote JavaScript for serious reasons.
  - I need some time for revisions before starting.

- I do not know Node.js.
  - I need to learn it from the beginning.

- Sometimes JavaScript gives programmer surprises.
  - `(a == b && b == c)` returns `true`, but `(a == c)` returns `false`:
    - `"" == 0` returns `true`
    - and `0 == "0"` returns `true`
    - but `"" == "0"` returns `false`
  - See [A Collection of JavaScript Gotchas](http://www.codeproject.com/Articles/182416/A-Collection-of-JavaScript-Gotchas) for more examples like this


