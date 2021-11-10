module.exports = {
  "presets": [
    ["@babel/preset-env",{
      targets:{
        "chrome":"58",
        "ie":11
      },
      useBuiltIns:"usage",
      corejs:{
        version:3,
      }
    }],
    "react-app"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining"
  ]
};