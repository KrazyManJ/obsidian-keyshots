import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
	globalIgnores([
		'node_modules',
		'dist',
        'scripts',
		'esbuild.config.mjs',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'package.json',
		'package-lock.json',
		'tsconfig.json',
        'jest.config.cjs'
	]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
                electron: 'readonly',
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mts', 'manifest.json'],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	...obsidianmd.configs.recommended.map(config => ({
        ...config,
        ignores: ['tests/**/*']
    })),
    {
        files: ['tests/**/*'],
        languageOptions: {
            globals: {
                ...globals.jest, // Enables Jest global variables
                ...globals.node, // Often needed for tests running in a Node environment
            },
        },
    }
);