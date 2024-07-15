import { Search } from "@carbon/react";
import React from "react";
import { Theme } from "@carbon/react";
import { useTheme } from "next-themes";

interface SearchBoxProps {
    onSearch: (searchTerm: string) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, searchTerm, setSearchTerm }) => {
    const theme = useTheme();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <Theme theme={theme.theme == "light" ? "white" : "g100"}>
            <div className="search-box-customview">
                <Search
                    size="lg"
                    placeholder="Search"
                    labelText="Search"
                    closeButtonLabelText="Clear search input"
                    id="search-1"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    value={searchTerm}
                    onKeyDown={(e) => {
                        handleChange(e);
                    }}
                />
            </div>
        </Theme>
    );
};

export default SearchBox;
