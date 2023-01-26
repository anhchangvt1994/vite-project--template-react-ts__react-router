import ModuleContentSection from 'components/content-page/ModuleContentSection'
import CommentSection from 'components/comment-page/CommentSection'
import { useParamsAdvance } from 'config/router/context/InfoContext'
import { generatePath } from 'react-router-dom'

// NOTE - Dummy Data Region
const response: {
	[key: string | number]: {
		title: string
		content: string
	}
} = {
	1: {
		title: 'Excepteur nostrud deserunt do ipsum eu dolore.',
		content:
			'Laboris cillum ex elit reprehenderit ad ullamco ut magna cupidatat labore veniam consectetur anim. Amet laborum ullamco velit nostrud sunt officia officia sunt consequat pariatur qui. Commodo nisi eiusmod aliquip officia pariatur esse labore tempor. Do ipsum nostrud nostrud commodo esse nisi reprehenderit tempor nostrud commodo voluptate fugiat sunt.',
	},
	2: {
		title:
			'Ex Lorem commodo nisi et qui adipisicing consectetur magna duis enim pariatur eu.',
		content:
			'Nisi laborum sint culpa ea quis eu aliquip pariatur incididunt ad do sunt. Eu dolore mollit et Lorem velit deserunt qui ut. Consequat magna do esse nisi non cillum laboris dolor excepteur Lorem proident. Adipisicing esse ut eiusmod Lorem dolor enim.',
	},
	3: {
		title: 'Dolor in voluptate anim magna.',
		content:
			'Cupidatat consectetur occaecat magna excepteur aute est eiusmod. Lorem minim reprehenderit magna aliquip tempor pariatur tempor cupidatat irure esse ipsum eiusmod elit excepteur. Non minim dolore eu ullamco ea in occaecat fugiat. Consequat sunt mollit magna id occaecat commodo qui dolor id.',
	},
	4: {
		title:
			'Eiusmod exercitation sint adipisicing magna sit dolore adipisicing.',
		content:
			'Aliqua sunt cupidatat ea ad est dolore. Ad reprehenderit eu labore adipisicing incididunt sit voluptate officia consequat minim proident. Sit minim laborum proident consequat fugiat pariatur ea ut exercitation. Ea aliqua do anim aute elit irure anim do. Ipsum aliqua sit et eu. Proident eu esse labore exercitation do nulla. Fugiat exercitation laborum id cupidatat qui.',
	},
}
// NOTE - End Dummy Data Region

// NOTE - Styled Components Region
const Page = styled.div``
// NOTE - End Styled Components Region

export default function ContentPage() {
	const { slugs, id } = useParamsAdvance()

	const data: {
		title: string
		content: string
	} = response[id as string]

	return (
		<Page>
			<div>
				<Link to={`/`}>Back to HomePage</Link>
			</div>

			<ModuleContentSection caption={data.title} content={data.content} />

			<Link
				to={generatePath('/:slugs/comment', {
					slugs: slugs as string,
				})}
			>
				View Comment
			</Link>

			<CommentSection>
				<Outlet />
			</CommentSection>
		</Page>
	)
}
