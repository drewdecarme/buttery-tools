// THIS FILE IS AUTO GENERATED BY `@BUTTERY/DOCS`. PLEASE DO NOT EDIT
import type { ButteryDocsGraph } from "@buttery/docs/types";
import { json } from "@remix-run/cloudflare";

const graph: ButteryDocsGraph = {
  introduction: {
    title: "Introduction",
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Introduction"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/getting-started/introduction",
    pages: {
      "basic-components": {
        title: "Basic Components",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Basic Components"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/introduction/basic-components",
        pages: {}
      },
      "advanced-components": {
        title: "Advanced Components",
        content:
          '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Advanced Components"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
        routePath: "/getting-started/introduction/advanced-components",
        pages: {}
      }
    }
  },
  "overview-of-security": {
    title: "Overview of Security",
    content:
      '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/security/overview-of-security",
    pages: {}
  },
  "prevention-of-attacks": {
    title: "Prevention of Attacks",
    content:
      '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  return _jsx(_Fragment, {});\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/security/prevention-of-attacks",
    pages: {}
  },
  "why-this": {
    title: "Why This",
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Why This?"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/introduction/why-this",
    pages: {}
  },
  _index: {
    title: "Welcome",
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Welcome!"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/introduction/_index",
    pages: {}
  },
  "quick-start-guide": {
    title: "Quick Start Guide",
    content:
      '"use strict";\nconst {jsx: _jsx} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    h1: "h1",\n    ...props.components\n  };\n  return _jsx(_components.h1, {\n    children: "Quick Start Guide"\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = props.components || ({});\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    routePath: "/getting-started/quick-start-guide",
    pages: {}
  }
};

/**
 * A loader that can either be imported as an alias and then re-exported
 * or straight up re-exported to be used in any route that only requires
 * the documentation graph
 */
export async function loader() {
  return json({ graph });
}

/**
 * A standalone function that fetches the graph from the loader that is defined
 * in this resource route.
 */
export async function getGraph(request: Request) {
  try {
    const requestURL = new URL(request.url);
    const res = await fetch(requestURL.origin.concat("/api/docs/graph"));
    const data = (await res.json()) as ButteryDocsGraph;
    return data;
  } catch (error) {
    throw new Response(
      `There was an error when trying to fetch the documentation graph: ${error}`,
      { status: 500 }
    );
  }
}
