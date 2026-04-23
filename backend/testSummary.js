require('dotenv').config();
const axios = require('axios');

// This test requires a valid course ID from your database
const testSummarize = async (courseId) => {
  try {
    console.log(`--- Testing Course Summary for ID: ${courseId} ---`);
    
    // Note: This requires a valid JWT token if the route is protected
    // For this test, I'll assume you might want to test it locally or via a script
    // If you haven't set up a user token here, you might need to make the route public momentarily
    
    const response = await axios.get(`http://localhost:5000/api/ai/summarize-course/${courseId}`, {
      // headers: { Authorization: `Bearer ${YOUR_TOKEN}` }
    });
    
    console.log('\n✅ Summary Generated:');
    console.log(response.data.summary);
  } catch (error) {
    console.error('\n❌ Summary Test Failed:', error.response?.data?.message || error.message);
    console.log('Ensure the route is public for testing or provide a token.');
  }
};

// Replace with a real course ID from your DB
// const COURSE_ID = 'your_course_id_here';
// testSummarize(COURSE_ID);

console.log('To test this, call testSummarize(COURSE_ID) with a valid ID.');
