module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    verbose: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@test/(.*)$": "<rootDir>/tests/$1",
    },
};
