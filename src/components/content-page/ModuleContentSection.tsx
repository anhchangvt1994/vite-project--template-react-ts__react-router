import ImageItem, { Outer as ImageOuter } from 'components/ImageItem'

const Section = styled.section`
	${ImageOuter} {
		height: 200px;
		max-width: 320px;
		margin: 0 auto;
		border: 1px solid ${import.meta.env.STYLE_COLOR_DARK};
	}
`
const Caption = styled.div`
	font-size: 12px;
	color: ${rgba(import.meta.env.STYLE_COLOR_DARK, 0.5)};
	margin-top: 8px;
`
const Content = styled.div`
	margin-top: 16px;
`

export default function ModuleContentSection({
	src,
	caption,
	content,
}: {
	src?: string
	caption: string
	content: string
}) {
	return (
		<Section>
			<ImageItem src={src || ''} alt={caption} />
			<Caption>{caption}</Caption>
			<Content>{content}</Content>
		</Section>
	)
}
