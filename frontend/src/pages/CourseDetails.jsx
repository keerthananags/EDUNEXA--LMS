import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Course Details: {id}</h2>
      <p>Detailed information for this course goes here.</p>
    </div>
  );
};

export default CourseDetails;
