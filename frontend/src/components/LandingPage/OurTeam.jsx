import React from "react";
import pic2 from "../../assets/team.jpeg";

const OurTeam = () => {
  const teamMembers = [
    {
      img: pic2,
      name: "Akhil Gupta",
      role: "Developed by",
      description: "",
    },
  ];

  return (
    <section className="bg-linear-to-br from-gray-900 to-black py-16 text-white">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="bg-linear-to-r from-teal-400 to-blue-500 bg-clip-text text-5xl font-extrabold text-transparent">
          Our Team
        </h2>
        <div className="mx-auto my-4 h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-teal-400" />
      </div>

      {/* Team Cards */}
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="relative w-72 rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Image Block - FIXED */}
            <div className="relative w-full overflow-hidden rounded-xl aspect-3/4 bg-black">
              <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Card Content */}
            <div className="mt-4 text-center">
              <h5 className="text-xl font-semibold text-teal-400">
                {member.role}
              </h5>
              <p className="mt-1 text-lg font-bold text-white underline">
                {member.name}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
