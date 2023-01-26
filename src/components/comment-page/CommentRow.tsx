import ImageItem, { Outer as ImageOuter } from 'components/ImageItem'
import { Suspender } from 'utils/Suspender'

const Row = styled.div`
	display: flex;
	margin-bottom: 24px;

	&:last-child {
		margin-bottom: 0;
	}
`
const AvatarCol = styled.div`
	margin-right: 8px;
	flex: 0 0 50px;
	height: 50px;
	${ImageOuter} {
		height: 100%;
		width: 100%;
		overflow: hidden;
		border-radius: 50%;
		background-color: ${rgba(import.meta.env.STYLE_COLOR_DARK, 0.1)};
		background-size: 16px 16px;
	}
`
const MetaCol = styled.div`
	min-width: 0;
	flex: 1 1 auto;
`
const NameLabel = styled.p`
	margin-bottom: 8px;
`
const ContentLabel = styled.div``

const data = Suspender(
	() =>
		new Promise((res) => {
			setTimeout(function () {
				res('OK')
			}, 2000)
		})
)

export default function CommentRow() {
	const amount = Math.floor(Math.random() * 4) + 1
	// console.log('run')
	data.start()

	const commentItemList = new Array(amount).fill(null).map((val, idx) => (
		<Row key={idx}>
			<AvatarCol>
				<ImageItem src="" />
			</AvatarCol>
			<MetaCol>
				<NameLabel>
					Proident consectetur deserunt officia consectetur ad aliqua do
					excepteur sit.
				</NameLabel>
				<ContentLabel>
					Excepteur reprehenderit minim officia anim occaecat nostrud nulla
					elit. Excepteur officia fugiat nisi anim enim quis proident
					consectetur exercitation. Consequat eu ea enim ullamco. Amet elit ad
					sit ipsum magna consequat exercitation consectetur ullamco.
				</ContentLabel>
			</MetaCol>
		</Row>
	))

	return <>{commentItemList}</>
}
