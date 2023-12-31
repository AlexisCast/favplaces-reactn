import { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Image, Text } from "react-native";
import {
	getCurrentPositionAsync,
	useForegroundPermissions,
	PermissionStatus,
} from "expo-location";
import {
	useNavigation,
	useRoute,
	useIsFocused,
} from "@react-navigation/native";

import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import { getAddress, getMapPreview } from "../../util/location";

const LocationPicker = ({ onPickLocation }) => {
	const [pickedLocation, setPickedLocation] = useState();
	const isFocused = useIsFocused();

	const navigation = useNavigation();
	const route = useRoute();

	const [locationPermissionInformation, requestPermission] =
		useForegroundPermissions();

	useEffect(() => {
		if (isFocused && route.params) {
			const mapPickedLocation = {
				lat: route.params.pickedLat,
				lng: route.params.pickedLng,
			};
			setPickedLocation(mapPickedLocation);
		}
	}, [route, isFocused]);

	useEffect(() => {
		async function handleLocation() {
			if (pickedLocation) {
				const address = await getAddress(
					pickedLocation.lat,
					pickedLocation.lng
				);
				onPickLocation({ ...pickedLocation, address: address });
			}
		}

		handleLocation();
	}, [pickedLocation, onPickLocation]);

	const verifyPermissions = async () => {
		if (
			locationPermissionInformation.status ===
				PermissionStatus.UNDETERMINED ||
			locationPermissionInformation.status === PermissionStatus.DENIED
		) {
			const permissionResponse = await requestPermission();

			return permissionResponse.granted;
		}

		if (locationPermissionInformation.status === PermissionStatus.DENIED) {
			Alert.alert(
				"Insufficient Permissions!",
				"You need to grant location permissions to use this app."
			);
			return false;
		}

		return true;
	};

	const getLocationHandler = async () => {
		const hasPermission = await verifyPermissions();

		if (!hasPermission) {
			return;
		}

		const location = await getCurrentPositionAsync();

		console.log(location);

		setPickedLocation({
			lat: location.coords.latitude,
			lng: location.coords.longitude,
		});
	};

	const pickOnMapHandler = () => {
		// navigation.navigate("Map");
		navigation.navigate("Map", {
			initialLat: pickedLocation.lat,
			initialLng: pickedLocation.lng,
			readOnly: false,
		});
	};

	let locationPreview = <Text>No location picked yet.</Text>;

	if (pickedLocation) {
		locationPreview = (
			<Image
				style={styles.image}
				source={{
					uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
				}}
			/>
		);
	}

	return (
		<View>
			<View style={styles.mapPreview}>{locationPreview}</View>
			<View style={styles.actions}>
				<OutlinedButton icon="location" onPress={getLocationHandler}>
					Locate User
				</OutlinedButton>
				{pickedLocation && (
					<OutlinedButton icon="map" onPress={pickOnMapHandler}>
						Pick on Map
					</OutlinedButton>
				)}
			</View>
		</View>
	);
};

export default LocationPicker;

const styles = StyleSheet.create({
	mapPreview: {
		width: "100%",
		height: 200,
		marginVertical: 8,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary100,
		borderRadius: 4,
		overflow: "hidden",
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		// borderRadius: 4
	},
});
