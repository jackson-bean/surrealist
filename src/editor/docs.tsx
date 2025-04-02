import { syntaxTree } from "@codemirror/language";
import { Extension, Prec, RangeSetBuilder } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";
import { isModKey } from "~/util/helpers";

const statement = (keyword: string) => `/surrealql/statements/${keyword}`;
const clause = (keyword: string) => `/surrealql/clauses/${keyword}`;

const KEYWORD_DOC_LINKS: Partial<Record<string, string>> = {
    "SELECT": statement("select"),
    "CREATE": statement("create"),
    "UPDATE": statement("update"),
    "LET": statement("let"),
    "DELETE": statement("delete"),
    "WHERE": clause("where"),
    "FROM": clause("from"),
    "DEFINE": statement("define"),
};

const DOC_LINK_MARK = (keyword: string) => Decoration.mark({
    class: "cm-doc-link",
    attributes: {
        title: "Cmd/Ctrl + Click to open docs for " + keyword,
    },
});

const DOC_LINK_DECORATOR = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    const tree = syntaxTree(view.state);

    tree.iterate({
        enter(node) {
            if (node.type.name === "Keyword") {
                const keyword = view.state.sliceDoc(node.from, node.to);
                const path = KEYWORD_DOC_LINKS[keyword];

                if (path) {
                    builder.add(node.from, node.to, DOC_LINK_MARK(keyword));
                }
            }
        },
    });

    return builder.finish();
};

export const surqlQuickDocs = (onClick: (path: string) => void): Extension => [
    EditorView.decorations.of(DOC_LINK_DECORATOR),
    Prec.highest(
        EditorView.domEventHandlers({
            mousedown: (event, view) => {
                if (!isModKey(event)) return false;

                const pos = view.posAtDOM(event.target as HTMLElement);
                let token = syntaxTree(view.state).resolveInner(pos, 1);

                while (token && token.name !== "Keyword") {
                    token = token.parent as any;
                }

                if (token) {
                    const keyword = view.state.sliceDoc(token.from, token.to);

                    if (keyword) {
                        const path = KEYWORD_DOC_LINKS[keyword];

                        if (path) {
                            onClick(path);
                        }

                        return true;
                    }
                }
            },
        }),
    ),
];