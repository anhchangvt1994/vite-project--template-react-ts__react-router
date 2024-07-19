import { IUserInfo, useUserInfo } from 'app/store/UserInfoContext'

export interface ICertCustomizationInfo {
	user: IUserInfo
}

export default function useCertificateCustomizationInfo(): ICertCustomizationInfo {
	const { userState } = useUserInfo()

	return {
		user: userState,
	}
}
