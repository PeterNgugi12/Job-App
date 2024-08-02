import { View, Text, ActivityIndicator,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { getFirestore, query,collection,where,getDocs } from 'firebase/firestore'
import JobItemList from '../../Components/HomeScreen/JobItemList'
import {app} from '../../firebaseConfig'


export default function JobList() {
    const {params}=useRoute()
  const db =getFirestore(app)
  const [jobList,setJobList]=useState([])
  const [loading,setLoading]=useState(false)

    useEffect(()=>{
       
      params&&getJobListByCategory()
    },[params])

    const getJobListByCategory=async()=>{
        setJobList([])
        setLoading(true)
        const q=query(collection(db,'UserPost'),where('category','==',params.category))
        const snapshot=await getDocs(q)
        snapshot.forEach(doc=>{
            console.log(doc.data)
            setJobList(jobList=>[...jobList,doc.data()])
            setLoading(false)
        })

    }
  return (
    <ScrollView>
        {loading ? (
            <ActivityIndicator size={'large'} color={'#0a85ed'} />
        ) : (
            <>
                {jobList.length > 0 ? (
                    <JobItemList jobItemList={jobList} />
                ) : (
                    <Text style={{ padding: 120, fontSize: 20, color: 'gray', marginTop: 74 }}>No Post Found</Text>
                )}
            </>
        )}
        <View style={{height:50}}/>
    </ScrollView>
)
 }