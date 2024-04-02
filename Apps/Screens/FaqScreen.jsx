import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const FaqScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Frequently Asked Questions</Text>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: How does this app work?</Text>
          <Text>A: Our app connects skilled individuals with job opportunities. Employers can post job listings, and users can browse and apply for jobs based on their skills and qualifications.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: What types of jobs are available on this app?</Text>
          <Text>A: Our app offers a wide range of job opportunities across various industries, including IT, marketing, design, customer service, and more. Users can find full-time, part-time, freelance, and remote positions.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: How can I hire someone with specific skills?</Text>
          <Text>A: Employers can create job listings specifying the required skills and qualifications. Our app provides tools for filtering candidates based on their skills, experience, and other criteria, making it easy to find the right person for the job.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Is it free to use this app?</Text>
          <Text>A: Yes, our app is free to download and use for both job seekers and employers. However, there may be additional premium features or services available for purchase.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Can I post multiple job listings?</Text>
          <Text>A: Yes, employers can post multiple job listings based on their hiring needs. Whether you're looking to fill one position or multiple positions, our app allows you to create and manage multiple job postings simultaneously.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: How do I edit or delete a job listing?</Text>
          <Text>A: Employers can easily edit or delete their job listings through the app's dashboard. Simply locate the job listing you wish to modify or remove, and use the provided options to make the necessary changes.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Can I receive notifications for new job listings?</Text>
          <Text>A: Yes, users can opt-in to receive notifications for new job listings that match their preferences. This feature ensures that you stay up-to-date with the latest job opportunities relevant to your skills and interests.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: How do I apply for a job?</Text>
          <Text>A: Applying for a job is simple. Once you find a job listing that interests you, click on it to view the details, and follow the instructions to submit your application. You may be required to provide your resume, cover letter, and other relevant documents depending on the employer's requirements.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Can I search for jobs in specific locations?</Text>
          <Text>A: Yes, our app allows users to search for job listings based on location. You can specify your desired location or use filters to narrow down your search results to jobs available in your preferred area or city.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Are remote job opportunities available?</Text>
          <Text>A: Yes, our app features remote job opportunities that allow individuals to work from anywhere. Whether you prefer the flexibility of remote work or are looking to join a distributed team, you can find remote job listings tailored to your skills and preferences.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: How can I track the status of my job applications?</Text>
          <Text>A: Users can track the status of their job applications through the app's dashboard. Once you've submitted an application, you'll receive updates on its status, including whether it's been received, reviewed, or if any further action is required on your part.</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Q: Can I save job listings for later?</Text>
          <Text>A: Yes, our app allows users to save job listings for future reference. You can bookmark job listings that interest you, making it easy to revisit them later and apply when you're ready. This feature helps you stay organized and keep track of your job search progress.</Text>
        </View>
        {/* Add more FAQ items as needed */}
      </View>
    </ScrollView>
  );
};

export default FaqScreen;


