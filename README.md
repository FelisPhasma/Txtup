# Txtup
A basic markup language for text files.

# Syntax
All commands go inside `%` symbols at the beginning of a line

Command | Description
--- | ---
`c` | Centers text
`h1` | Applies h1 formatting
`h2` | Applies h2 formatting
`docwidth=x` | Sets document width in characters. Default = `100`
`\%` | Escapes `%` at the beginning of a line

Lines are automatically wrapped such that they don't overflow the `docwidth`. 

# Installation and Ussage

```
npm install -g txtup

txtup TxtupDir
```

All `.txtup` files are compiled to an `.txt` with the same name file.

# Examples

```
%docwidth=200%
%c% Centered text
%h1% First header
%h2% Second header
\% This percent isn't treated as a command
All lines that don't start with a command are wrapped if they overflow the docwidth
```

# License

Licensed under the FOSSL-G License. (https://github.com/FelisPhasma/Felis-Licenses)

# Upcoming features 

Command | Description
--- | ---
`>` | Blockquote
