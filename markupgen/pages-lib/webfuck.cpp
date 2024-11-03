#include "./webfuck.hh"

std::string starsignjs::webfuck::initWebFuck() {
    return "<script src=\"/libwebfuck.js\"></script>";
}

std::string starsignjs::webfuck::webFuckUp(std::string name) {
    std::string tag = "<script>async function loadWebFuck";
    tag = tag.append(name);
    tag = tag.append("() { let wf = await loadWebFuck(\"webfucks/");
    tag = tag.append(name);
    tag = tag.append(".wf\"); wf.call() } loadWebFuck");
    tag = tag.append(name);
    tag = tag.append("(); </script>");
    return tag;
}
