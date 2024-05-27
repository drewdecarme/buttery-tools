import type { ButteryDocsGraph } from "../types";

export const graph: ButteryDocsGraph = {
  _index: {
    title: "_index",
    content: "",
    routePath: "",
    toc: [],
    pages: {}
  },
  introduction: {
    title: "Intro",
    content: "",
    routePath: "",
    toc: [],
    pages: {
      _index: {
        title: "Welcome",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Welcome!"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/introduction/_index",
        toc: [
          {
            level: 1,
            title: "Welcome!",
            link: "#welcome",
            children: []
          }
        ],
        pages: {}
      },
      "why-this": {
        title: "Why This",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Why This?"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/introduction/why-this",
        toc: [
          {
            level: 1,
            title: "Why This?",
            link: "#why-this",
            children: []
          }
        ],
        pages: {}
      }
    }
  },
  "getting-started": {
    title: "Getting Started",
    content: "",
    routePath: "",
    toc: [],
    pages: {
      introduction: {
        title: "Introduction",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Introduction"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/introduction",
        toc: [
          {
            level: 1,
            title: "Introduction",
            link: "#introduction",
            children: []
          }
        ],
        pages: {
          "basic-components": {
            title: "Basic Components",
            content:
              '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Basic Components"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
            routePath: "/getting-started/introduction/basic-components",
            toc: [
              {
                level: 1,
                title: "Basic Components",
                link: "#basic-components",
                children: []
              }
            ],
            pages: {}
          },
          "advanced-components": {
            title: "Advanced Components",
            content:
              '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    code: "code",\n    h1: "h1",\n    h2: "h2",\n    h3: "h3",\n    ...props.components\n  };\n  return _jsxs(_Fragment, {\n    children: [_jsx(_components.h1, {\n      children: "Advanced Components"\n    }), "\\n", _jsx(_components.h2, {\n      children: "Overview"\n    }), "\\n", _jsx(_components.h2, {\n      children: "Explanation"\n    }), "\\n", _jsx(_components.h3, {\n      children: "Technical Requirements"\n    }), "\\n", _jsx(_components.h2, {\n      children: "Testing"\n    }), "\\n", _jsx(_components.h3, {\n      children: "Testing with vitest"\n    }), "\\n", _jsxs(_components.h3, {\n      children: ["Testing with ", _jsx(_components.code, {\n        children: "jest"\n      })]\n    })]\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
            routePath: "/getting-started/introduction/advanced-components",
            toc: [
              {
                level: 1,
                title: "Advanced Components",
                link: "#advanced-components",
                children: [
                  {
                    level: 2,
                    title: "Overview",
                    link: "#overview",
                    children: []
                  },
                  {
                    level: 2,
                    title: "Explanation",
                    link: "#explanation",
                    children: [
                      {
                        level: 3,
                        title: "Technical Requirements",
                        link: "#technical-requirements",
                        children: []
                      }
                    ]
                  },
                  {
                    level: 2,
                    title: "Testing",
                    link: "#testing",
                    children: [
                      {
                        level: 3,
                        title: "Testing with vitest",
                        link: "#testing-with-vitest",
                        children: []
                      },
                      {
                        level: 3,
                        title: "Testing with jest",
                        link: "#testing-with-jest",
                        children: []
                      }
                    ]
                  }
                ]
              }
            ],
            pages: {}
          }
        }
      },
      "quick-start-guide": {
        title: "Quick Start Guide",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Quick Start Guide"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/quick-start-guide",
        toc: [
          {
            level: 1,
            title: "Quick Start Guide",
            link: "#quick-start-guide",
            children: []
          }
        ],
        pages: {}
      }
    }
  },
  security: {
    title: "Securing your app",
    content: "",
    routePath: "",
    toc: [],
    pages: {
      "overview-of-security": {
        title: "Overview of Security",
        content:
          '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/security/overview-of-security",
        toc: [],
        pages: {}
      },
      "prevention-of-attacks": {
        title: "Prevention of Attacks",
        content:
          '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/security/prevention-of-attacks",
        toc: [],
        pages: {}
      }
    }
  }
};
