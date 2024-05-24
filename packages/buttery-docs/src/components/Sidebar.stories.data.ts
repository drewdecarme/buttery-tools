import type { ButteryDocsGraph } from "../types";

export const graph: ButteryDocsGraph = {
  "getting-started": {
    title: "",
    isSection: true,
    sectionTitle: "getting started",
    content: "",
    routePath: "",
    pages: {
      introduction: {
        title: "Introduction",
        isSection: false,
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Introduction"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/introduction",
        pages: {
          "basic-components": {
            title: "Basic Components",
            isSection: false,
            content:
              '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Basic Components"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
            routePath: "/getting-started/introduction/basic-components",
            pages: {}
          },
          "advanced-components": {
            title: "Advanced Components",
            isSection: false,
            content:
              '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Advanced Components"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
            routePath: "/getting-started/introduction/advanced-components",
            pages: {}
          }
        }
      },
      "quick-start-guide": {
        title: "Quick Start Guide",
        isSection: false,
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Quick Start Guide"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/quick-start-guide",
        pages: {}
      }
    }
  },
  security: {
    title: "",
    isSection: true,
    sectionTitle: "security",
    content: "",
    routePath: "",
    pages: {
      "overview-of-security": {
        title: "Overview of Security",
        isSection: false,
        content:
          '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/security/overview-of-security",
        pages: {}
      },
      "prevention-of-attacks": {
        title: "Prevention of Attacks",
        isSection: false,
        content:
          '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/security/prevention-of-attacks",
        pages: {}
      }
    }
  },
  "why-this": {
    title: "Why This",
    isSection: false,
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Why This?"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/why-this",
    pages: {}
  },
  welcome: {
    title: "Welcome",
    isSection: false,
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Welcome!"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/welcome",
    pages: {}
  },
  _index: {
    title: "Home Page",
    isSection: false,
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Welcome"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/",
    pages: {}
  }
};
