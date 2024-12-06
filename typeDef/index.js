import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./types/usertypeDef.js";
import transactionTypeDef from "./types/transactiontypeDef.js";

// typeDefsf

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;
