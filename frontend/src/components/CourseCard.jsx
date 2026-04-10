import React from "react";
import { motion } from "framer-motion";

const CourseCard = ({ title, instructor, price, progress, image }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden transition"
    >
      {/* Course Image */}
      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1513258496099-48168024aec0"
        }
        alt="course"
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{instructor}</p>

        {/* Progress Bar (optional) */}
        {progress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progress}</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400"
                style={{ width: progress }}
              ></div>
            </div>
          </div>
        )}

        {/* Price + Button */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-purple-600 font-bold">{price}</span>

          <button className="px-4 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;