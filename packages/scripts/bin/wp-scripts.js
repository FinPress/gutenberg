#!/usr/bin/env node

/**
 * Internal dependencies
 */
import { getNodeArgsFromCLI, spawnScript } from '../utils/cli.js';

const { scriptName, scriptArgs, nodeArgs } = getNodeArgsFromCLI();

spawnScript( scriptName, scriptArgs, nodeArgs );
