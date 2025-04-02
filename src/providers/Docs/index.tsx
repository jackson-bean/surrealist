import { useDisclosure } from "@mantine/hooks";
import { type PropsWithChildren, createContext, useContext, useState } from "react";
import { useStable } from "~/hooks/stable";
import { DocsDrawer } from "./drawer";

type OpenDocsFunction = (path: string) => void;
type StopDocsFunction = () => void;

const DocsContext = createContext<{
	openDocs: OpenDocsFunction;
	closeDocs: StopDocsFunction;
} | null>(null);

/**
 * Access the docs functions
 */
export function useDocs() {
	const ctx = useContext(DocsContext);

	return (
		ctx ?? {
			openDocs: () => { },
			closeDocs: () => { },
		}
	);
}

export function DocsProvider({ children }: PropsWithChildren) {
	const [isDocsOpened, isDocsOpenedHandle] = useDisclosure();
	const [path, setPath] = useState<string>();

	// const openDocs = useStable((path: string) => {
	// 	setPath(path);

	// 	isDocsOpenedHandle.open();
	// });

	const openDocs = (path: string) => {
		setPath(path);

		isDocsOpenedHandle.open();
	}

	const closeDocs = useStable(() => {
		isDocsOpenedHandle.close();
	});

	return (
		<DocsContext.Provider value={{ openDocs, closeDocs }}>
			{children}

			<DocsDrawer
				opened={isDocsOpened}
				path={path}
				onClose={isDocsOpenedHandle.close}
			/>
		</DocsContext.Provider>
	);
}
