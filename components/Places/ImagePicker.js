import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import {
	launchCameraAsync,
	useCameraPermissions,
	PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";

import { Colors } from "../../constants/colors";

const ImagePicker = () => {
	const [pickedImage, setPickedImage] = useState();

	const [cameraPermissionInformation, requestPermission] =
		useCameraPermissions();

	const verifyPermissions = async () => {
		if (
			cameraPermissionInformation.status ===
				PermissionStatus.UNDETERMINED ||
			cameraPermissionInformation.status === PermissionStatus.DENIED
		) {
			const permissionResponse = await requestPermission();

			return permissionResponse.granted;
		}

		if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
			Alert.alert(
				"Insufficient Permissions!",
				"You need to grant camera permissions to use this app."
			);
			return false;
		}

		return true;
	};

	const takeImagehandler = async () => {
		const hasPermission = await verifyPermissions();

		if (!hasPermission) {
			return;
		}

		const image = await launchCameraAsync({
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.5,
		});

		// console.log(image.assets[0]);
		setPickedImage(image.assets[0].uri);
	};

	let imagePreview = <Text>No image taken yet.</Text>;

	if (pickedImage) {
		imagePreview = (
			<Image style={styles.image} source={{ uri: pickedImage }} />
		);
	}

	return (
		<View>
			<View style={styles.imagePreview}>{imagePreview}</View>

			<Button title="Take Image" onPress={takeImagehandler} />
		</View>
	);
};

export default ImagePicker;

const styles = StyleSheet.create({
	imagePreview: {
		width: "100%",
		height: 200,
		marginVertical: 8,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary100,
		borderRadius: 4,
	},
	image: {
		width: "100%",
		height: "100%",
	},
});
