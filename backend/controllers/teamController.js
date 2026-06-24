const TeamMember = require('../models/TeamMember');
const { logEvent } = require('../utils/logger');

// Default initial team members to seed if empty
const defaultTeam = [
  {
    name: "Dipendra Upadhayay",
    role: "Backend & Frontend Developer",
    description: "Responsible for full-stack system architecture, routing, model designs, alarm synthesis, and API integration.",
    email: "info.dipendraupadhayay.2005@gmail.com",
    photo: "", // Initial empty base64, falls back to letter avatar
    contactNumber: "+91 8886665432",
    instagramLink: "https://instagram.com/dipendra",
    facebookLink: "https://facebook.com/dipendra"
  },
  {
    name: "Prince Yadav",
    role: "UI/UX Designer",
    description: "Responsible for visual interface designs, wireframes, color schemas, glassmorphic layouts, and responsiveness controls.",
    email: "prince.yadav@gmail.com",
    photo: "",
    contactNumber: "+91 8886661111",
    instagramLink: "https://instagram.com/prince",
    facebookLink: "https://facebook.com/prince"
  },
  {
    name: "Manish Bishwakarma",
    role: "Database Handler",
    description: "Responsible for MongoDB data mapping, schema integrity, queries optimizations, and file database fallback engine.",
    email: "manish.bishwakarma@gmail.com",
    photo: "",
    contactNumber: "+91 8886662222",
    instagramLink: "https://instagram.com/manish",
    facebookLink: "https://facebook.com/manish"
  },
  {
    name: "Pravej Hawari",
    role: "Database Handler",
    description: "Contributed to database architectures, query definitions, audit logger setups, and profile synchronization routines.",
    email: "pravej.hawari@gmail.com",
    photo: "",
    contactNumber: "+91 8886663333",
    instagramLink: "https://instagram.com/pravej",
    facebookLink: "https://facebook.com/pravej"
  },
  {
    name: "Prash Yadav",
    role: "Database Handler",
    description: "Worked on record security layouts, permission controls for parent logins, and data structures backups.",
    email: "prash.yadav@gmail.com",
    photo: "",
    contactNumber: "+91 8886664444",
    instagramLink: "https://instagram.com/prash",
    facebookLink: "https://facebook.com/prash"
  },
  {
    name: "Deepak Lodh",
    role: "Marketing Handler",
    description: "Manages user engagement strategies, promotional writeups, college outreach programs, and store publication designs.",
    email: "deepak.lodh@gmail.com",
    photo: "",
    contactNumber: "+91 8886665555",
    instagramLink: "https://instagram.com/deepak",
    facebookLink: "https://facebook.com/deepak"
  }
];

// @desc    Get all team members (public)
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    let members = await TeamMember.find();
    if (members.length === 0) {
      // Seed default team members
      console.log('[TeamSeeder] Seeding default team members...');
      for (const member of defaultTeam) {
        await TeamMember.create(member);
      }
      members = await TeamMember.find();
    }
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Failed to fetch team members' });
  }
};

// @desc    Add a new team member
// @route   POST /api/admin/team
// @access  Private (Admin)
const createTeamMember = async (req, res) => {
  const { name, email, role, description, photo, contactNumber, instagramLink, facebookLink } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required' });
  }

  try {
    const newMember = await TeamMember.create({
      name,
      email,
      role,
      description: description || '',
      photo: photo || '',
      contactNumber: contactNumber || '',
      instagramLink: instagramLink || '',
      facebookLink: facebookLink || ''
    });

    logEvent('TEAM_MEMBER_CREATED', req.user._id, req.user.role, `Created team member: ${name} (${role})`);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: 'Failed to create team member' });
  }
};

// @desc    Update a team member
// @route   PUT /api/admin/team/:id
// @access  Private (Admin)
const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, description, photo, contactNumber, instagramLink, facebookLink } = req.body;

  try {
    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const updated = await TeamMember.findByIdAndUpdate(id, {
      name: name || member.name,
      email: email || member.email,
      role: role || member.role,
      description: description !== undefined ? description : member.description,
      photo: photo !== undefined ? photo : member.photo,
      contactNumber: contactNumber !== undefined ? contactNumber : member.contactNumber,
      instagramLink: instagramLink !== undefined ? instagramLink : member.instagramLink,
      facebookLink: facebookLink !== undefined ? facebookLink : member.facebookLink
    }, { new: true });

    logEvent('TEAM_MEMBER_UPDATED', req.user._id, req.user.role, `Updated team member ID: ${id}`);
    res.json(updated);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Failed to update team member' });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/admin/team/:id
// @access  Private (Admin)
const deleteTeamMember = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await TeamMember.deleteOne({ _id: id });
    logEvent('TEAM_MEMBER_DELETED', req.user._id, req.user.role, `Deleted team member: ${member.name}`);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Failed to delete team member' });
  }
};

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
