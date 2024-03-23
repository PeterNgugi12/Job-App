import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, Linking, Share, CameraRoll, PermissionsAndroid, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getDocs, doc, getFirestore, collection } from 'firebase/firestore';
import { app } from '../../firebaseConfig'
import { useUser } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

const JobDetails = () => {
    const db = getFirestore(app)
    const { params } = useRoute();
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 1, height: 1 });
    const { user } = useUser()

    useEffect(() => {
        if (params && params.job && params.job.images) {
            setImages(params.job.images);
        }
    }, [params]);

    const getImageDimensions = (uri) => {
        Image.getSize(uri, (width, height) => {
            const aspectRatio = width / height;
            const screenWidth = Dimensions.get('window').width;
            const screenHeight = Dimensions.get('window').height;

            // Calculate the dimensions to fit within the screen while maintaining aspect ratio
            const maxWidth = screenWidth * 0.9; // 90% of screen width
            const maxHeight = screenHeight * 0.9; // 90% of screen height

            let newWidth = maxWidth;
            let newHeight = maxWidth / aspectRatio;

            // If the height exceeds the screen height, resize based on height instead
            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = maxHeight * aspectRatio;
            }

            setImageDimensions({ width: newWidth, height: newHeight });
        });
    };

    const handleImagePress = async (image) => {
        setSelectedImage(image);
        getImageDimensions(image); // Fetch image dimensions
        setIsModalVisible(true);
    };
    const shareImage = async () => {
        try {
            const imageUrl = selectedImage;
            const result = await Share.share({
                message: imageUrl,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    const downloadImage = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'This app needs access to your storage to download photos',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const imageUrl = selectedImage;
                CameraRoll.save(imageUrl, { type: 'photo' });
                alert('Image downloaded successfully');
            } else {
                alert('Storage permission denied');
            }
        } catch (error) {
            alert('Error downloading image: ' + error);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const sendEmailMessage = () => {
        const subject = 'Regarding ' + params.job.title;
        const body = "Hi " + params.job.userName + "\n" + "I am interested to Hire you?"
        Linking.openURL('mailto:' + params.job.userEmail + "?subject=" + subject + "&body=" + body)
    }

    const makePhoneCall = () => {
        Linking.openURL(`tel:${params.job.phoneNumber}`);
    };
    const handleDirectionPress = async () => {
        try {
            // Fetch the selectedLocation from your UserPost data
            const selectedLocation = params.job.selectedLocation;
            navigation.navigate('MapScreen', { selectedLocation });
        } catch (error) {
            console.error('Error navigating to MapScreen:', error);
        }
    };


    return (
        <ScrollView nestedScrollEnabled={true} style={styles.container} showsVerticalScrollIndicator={false}>
            <View>
                <Image style={styles.title} source={{ uri: params.job?.userImage }} />
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>{params.job?.userName}</Text>
                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>{params.job?.userEmail}</Text>

                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>Professional:{params.job?.title}</Text>
                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center', backgroundColor: 'blue', color: 'white', borderRadius: 60, marginTop: 5 }}>{params.job?.category}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Description</Text>
                <Text style={{ fontSize: 17, fontWeight: '200', padding: 10 }}>{params.job?.desc}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => sendEmailMessage()}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', }}>Message</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => makePhoneCall()}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', justifyContent: 'center', }}>Call{params.job?.userphoneNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDirectionPress}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Direction</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageRowContainer}>
  {images.map((item, index) => (
    <TouchableOpacity key={index} onPress={() => handleImagePress(item)} style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  ))}
</View>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={closeModal}
                backdropColor="black"
                backdropOpacity={0.9}
                animationIn="fadeIn"
                animationOut="fadeOut"
                navigation={navigation}
                style={styles.modalContainer}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ width: imageDimensions.width, height: imageDimensions.height }}
                        resizeMode="contain"
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <TouchableOpacity onPress={shareImage}>
                            <Text style={{ color: 'white', marginTop: 10, }}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={downloadImage}>
                            <Text style={{ color: 'white', marginTop: 10, marginLeft: 30 }}>Download</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            <View style={{height:70}}/>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: '32%', // Adjust this value according to your preference
        aspectRatio: 1, // Maintain aspect ratio
        marginVertical: 5,
        borderRadius: 10,
        overflow: 'hidden',
      },
      image: {
        flex: 1,
      },
    title: {
        marginTop: 20,

        textAlign: 'center',
        backgroundColor: 'white',
        height: 200,
        width: 200,
        borderRadius: 100,
        justifyContent: 'center',
        marginLeft: 85,
        flexWrap: 'wrap',
        paddingVertical: 80
    },
    modalContainer: {
        margin: 0, // Ensure the modal takes the entire screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageRowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
});

export default JobDetails;

