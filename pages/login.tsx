
import { GoogleSignin, GoogleSigninButton, statusCodes, User } from '@react-native-community/google-signin';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { StyledWrapper } from '../components/style/StyledComponent';
import motiLogo from '../static/assets/images/motiLogo.png';
import axios from 'axios';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '938345031982-2p7t2b0rj9al14a4re0ec96qnsph69p0.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: 'https://yuni-q.herokuapp.com', // specifies a hosted domain restriction
  // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '938345031982-2p7t2b0rj9al14a4re0ec96qnsph69p0.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const StyledAppleLoginButton = styled.View`
	background-color: #fff;
	width: 260px;
	height: 44px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20px;
	margin: 24px 0 0;
	
	& > Image {
		width: 22px;
		height: 22px;
		background-color: #fff;
	}

	& > View {
		font-size: 14px;
		background-color: #fff;
	}
`;

const Login: React.FC = () => {
	const [userInfo, setuserInfo] = useState({} as User);
	const signIn = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			await GoogleSignin.signIn();
			const tokenObj = await GoogleSignin.getTokens();
			const result = await axios.post(
				'https://moti.company/api/v1/signin',
				{ snsType: 'google' },
				{
					headers: { Authorization: tokenObj.accessToken },
				},
			);
			const token = result.data.data.accessToken;
			console.log('token',token)
			// setuserInfo(userInfo);
		} catch (error) {
			console.log('error',error)
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
			} else if (error.code === statusCodes.IN_PROGRESS) {
				// operation (e.g. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				// play services not available or outdated
			} else {
				// some other error happened
			}
		}
	}
	return (
		<StyledWrapper>
			<View>
				<Image source={motiLogo} />
			</View>
			<GoogleSigninButton
				style={{ width: 192, height: 48 }}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={signIn}
				// disabled={this.state.isSigninInProgress} 
			/>
			<View>
			<Text>
				Make Own True Identity
			</Text>
			</View>
		</StyledWrapper>
	);
};

export default Login;
