import { DEFAULT_PAGE } from "@/constants";
import { parseAsInteger , parseAsString, useQueryStates } from "nuqs";
export const useAgentsFilter = () =>{
    return useQueryStates({
        search : parseAsString.withDefault("").withOptions({clearOnDefault : true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true})
    })
};

//localhost:3000?search=hello <===> useState()


//useQueryStates → hook to sync state with URL

// parseAsString → read/write string query params

// parseAsInteger → read/write number query params