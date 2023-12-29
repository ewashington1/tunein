import { Dispatch, SetStateAction, createContext } from "react";

const SearchPanelContext = createContext<{
  setSearchPanel: Dispatch<SetStateAction<boolean>>;
}>(null!);

export default SearchPanelContext;
