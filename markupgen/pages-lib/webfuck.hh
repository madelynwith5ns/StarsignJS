#pragma once
#include <string>

namespace starsignjs::webfuck {
    /**
     * Initialize WebFuck.
     */
    std::string initWebFuck();
    
    /**
     * WebFuck-up the page with some webfuck.
     */
    std::string webFuckUp(std::string name);
}
