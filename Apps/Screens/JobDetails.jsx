import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, Linking, Share, CameraRoll, PermissionsAndroid, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getDocs, collection, addDoc, Timestamp, getFirestore, doc, updateDoc, increment,setDoc,getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { AirbnbRating } from 'react-native-ratings';

const { width, height } = Dimensions.get('window');

const JobDetails = () => {
    const db = getFirestore(app);
    const { params } = useRoute();
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 1, height: 1 });
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [viewCounts, setViewCounts] = useState({}); // State to store view counts for each image
    const job = params?.job; // Access the jobId parameter from params object
    useEffect(() => {
        if (params && params.job && params.job.images) {
            setImages(params.job.images);
            fetchViewCounts(params.job.images);
        }
    }, [params]);
    
    const fetchViewCounts = async (imageUrls) => {
        try {
            const viewCountsSnapshot = await Promise.all(imageUrls.map(async imageUrl => {
                const cleanImageUrl = imageUrl.replace(/\/\//g, '/'); // Remove double slashes from imageUrl
                const documentId = hashUrl(cleanImageUrl); // Generate document ID
                const imageRef = doc(db, 'images', documentId);
                const snapshot = await getDoc(imageRef);
                if (snapshot.exists()) {
                    return { imageUrl, count: snapshot.data().views || 0 };
                } else {
                    return { imageUrl, count: 0 };
                }
            }));
            const updatedViewCounts = {};
            viewCountsSnapshot.forEach(({ imageUrl, count }) => {
                updatedViewCounts[imageUrl] = count;
            });
            setViewCounts(updatedViewCounts);
        } catch (error) {
            console.error('Error fetching view counts:', error);
        }
    };
    

    const fetchComments = async (text) => {
        try {
            const commentsSnapshot = await getDocs(collection(db, 'comments'));
            const commentsData = commentsSnapshot.docs
                .map(doc => doc.data())
                .filter(comment => comment.text === text); // Filter comments by text
            console.log('Fetched comments:', commentsData);
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
            // Add additional error handling here
        }
    };

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
        setIsModalVisible(true);
        const cleanImageUrl = image.replace(/\/\//g, '/'); 
        incrementViewCount(cleanImageUrl);

        getImageDimensions(image);
    };
    

    const incrementViewCount = async (imageUrl) => {
        try {
            const documentId = hashUrl(imageUrl);
            const imageRef = doc(db, 'images', documentId);
            const docSnapshot = await getDoc(imageRef);
            if (docSnapshot.exists()) {
                await updateDoc(imageRef, { views: increment(1) });
            } else {
                await setDoc(imageRef, { imageUrl, views: 1 });
            }
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    };
    
    // Function to hash the URL and generate a unique document ID
    const hashUrl = (url) => {
        // Remove double slashes from the URL
        const cleanUrl = url.replace(/\/\//g, '/');
        // Generate a hash based on the cleaned URL
        let hash = 0;
        if (cleanUrl.length === 0) return hash;
        for (let i = 0; i < cleanUrl.length; i++) {
            let char = cleanUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
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
    };

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

    const handleRating = (rating) => {
        // You can perform actions with the rating, such as submitting it to a backend or updating state
        setRating(rating);
    };

    const handleCommentSubmit = async () => {
        try {
            if (!job) {
                console.error('Job ID is undefined.');
                return;
            }
            // Add the comment to Firestore
            const commentData = {
                job: job,
                userId: user.id,
                text: commentText,
                timestamp: Timestamp.fromDate(new Date())
            };
            // Check if jobId is defined before adding the comment
            if (job) {
                await addDoc(collection(db, 'comments'), commentData);
                // Refresh comments
                fetchComments(job.text);
                // Clear the comment input field
                setCommentText('');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <ScrollView nestedScrollEnabled={true} style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => handleImagePress(params.job?.profileImage)}>
                <View>
                    <Image style={styles.title} source={{ uri: params.job?.profileImage }} />
                </View>
            </TouchableOpacity>

            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>{params.job?.userName}</Text>
                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>{params.job?.userEmail}</Text>

                <Text style={{ fontSize: 20, fontWeight: '400', textAlign: 'center' }}>Professional:{params.job?.title}</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center',  color: 'grey', borderRadius: 60, marginTop: 5, }}>{params.job?.category}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Description</Text>
                <Text style={{ fontSize: 17, fontWeight: '400', padding: 10,color:'black' }}>{params.job?.desc}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => sendEmailMessage()}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold',backgroundColor:'#0a85ed',color:'white',width:90,height:20,textAlign:'center',borderRadius:20}}>Message</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => makePhoneCall()}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', justifyContent: 'center',backgroundColor:'#0a85ed',color:'white',width:90,height:20,textAlign:'center',borderRadius:20 }}>Call{params.job?.userphoneNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDirectionPress}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold',backgroundColor:'#0a85ed',color:"white" ,width:90,height:20,textAlign:'center',borderRadius:20}}>Direction</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageRowContainer}>
                {images.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleImagePress(item)} style={styles.imageContainer}>
                        <Image source={{ uri: item }} style={styles.image} />
                        <Text style={styles.viewCount}>{viewCounts[item]}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Rating Section */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingTitle}>Rate this Professional:</Text>
                <AirbnbRating
                    count={5}
                    reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
                    defaultRating={rating}
                    size={30}
                    onFinishRating={handleRating}
                />
            </View>

            {/* Comment Section */}
            <View style={styles.commentContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Leave a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
                    <Text style={styles.commentButtonText}>Post</Text>
                </TouchableOpacity>
            </View>

            {/* Display Comments */}
            <View style={styles.commentSection}>
                <Text style={styles.commentSectionTitle}>Comments</Text>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                        <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
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
                            <Text style={{ color: 'white', marginTop: 10 }}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={downloadImage}>
                            <Text style={{ color: 'white', marginTop: 10, marginLeft: 30 }}>Download</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            <View style={{ height: 70 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: '32%', // Adjust width to fit three images in a row
        aspectRatio: 1, // Maintain aspect ratio
        marginBottom: 10, // Add margin bottom to create space between images
        marginRight: 2, // Adjust this value to control the spacing

    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    title: {
        marginTop: 20,
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
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        marginBottom: 10, // Add margin bottom to create space between rows
    },
    ratingContainer: {
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    ratingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    commentButton: {
        backgroundColor: '#0a85ed',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    commentButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    commentSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    commentText: {
        fontSize: 16,
    },
    viewCount: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        color: 'white',
        fontSize: 12,
    },
});

export default JobDetails;






