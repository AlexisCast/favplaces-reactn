import { REACT_APP_GOOGLE_API_KEY } from "@env";

export const getMapPreview = (lat, lng) => {
	const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${REACT_APP_GOOGLE_API_KEY}`;
	return imagePreviewUrl;
};
