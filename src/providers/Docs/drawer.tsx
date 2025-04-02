import classes from "./style.module.scss";

import { Drawer } from "@mantine/core";
import { useRef, useState } from "react";
import { DrawerResizer } from "~/components/DrawerResizer";

export interface DocsDrawerProps {
	opened: boolean;
	path?: string;
	onClose: () => void;
}

export function DocsDrawer({ opened, path, onClose }: DocsDrawerProps) {
	const frameRef = useRef<HTMLIFrameElement>(null);
	const [width, setWidth] = useState(800);
	const [resizing, setResizing] = useState(false);

	const baseUrl = "http://localhost:4321";

	return (
		<Drawer
			opened={opened}
			onClose={onClose}
			position="right"
			trapFocus={false}
			size={width}
			padding={0}
			styles={{
				body: {
					height: "100%",
					display: "flex",
					flexDirection: "column",
				},
			}}
		>
			<DrawerResizer
				minSize={500}
				maxSize={1500}
				onResize={setWidth}
				onResizingChange={setResizing}
			/>

			{/* <Group
				mb="md"
				gap="sm"
			>
				<PrimaryTitle>
					<Icon
						left
						path={iconSearch}
						size="sm"
					/>
					Documentation
				</PrimaryTitle>

				<Spacer />

				<Group align="center">
					<ActionButton
						onClick={onClose}
						label="Close drawer"
					>
						<Icon path={iconClose} />
					</ActionButton>
				</Group>
			</Group> */}

			<iframe
				className={classes.frame}
				ref={frameRef}
				src={baseUrl + path}
				style={{ pointerEvents: resizing ? "none" : undefined }}
			/>
		</Drawer>
	);
}
