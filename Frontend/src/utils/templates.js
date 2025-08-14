// Resume Template Styles
export const templates = {
  modern: {
    name: "Modern",
    description: "Clean, professional layout with clear sections",
    format: (data) => {
      const parts = [];
      
      // Header
      const header = [
        `# ${data.full_name}`,
        `## ${data.target_title}`,
        data.email ? `📧 ${data.email}` : "",
        data.phone ? `📱 ${data.phone}` : "",
        data.location ? `📍 ${data.location}` : "",
        data.links ? `🔗 ${data.links}` : "",
      ].filter(Boolean);
      parts.push(header.join("\n"));
      
      // Summary
      if (data.summary) {
        parts.push(`\n## Summary\n${data.summary}`);
      }
      
      // Experience
      if (data.experiences && data.experiences.length > 0) {
        parts.push("\n## Professional Experience");
        data.experiences.forEach(exp => {
          parts.push(`### ${exp.role} at ${exp.company}`);
          parts.push(`*${exp.start} - ${exp.end || 'Present'}*`);
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(achievement => {
              parts.push(`• ${achievement}`);
            });
          }
          parts.push("");
        });
      }
      
      // Education
      if (data.education && data.education.length > 0) {
        parts.push("## Education");
        data.education.forEach(edu => {
          const degree = edu.degree ? `, ${edu.degree}` : "";
          parts.push(`### ${edu.school}${degree}`);
          parts.push(`*${edu.start} - ${edu.end || ''}*`);
        });
        parts.push("");
      }
      
      // Skills
      if (data.skills) {
        parts.push("## Skills");
        parts.push(data.skills);
      }
      
      return parts.join("\n");
    }
  },
  
  classic: {
    name: "Classic",
    description: "Traditional format with strong typography",
    format: (data) => {
      const parts = [];
      
      // Header
      parts.push(`${data.full_name.toUpperCase()}`);
      parts.push(`${data.target_title}`);
      const contact = [];
      if (data.email) contact.push(data.email);
      if (data.phone) contact.push(data.phone);
      if (data.location) contact.push(data.location);
      if (data.links) contact.push(data.links);
      if (contact.length > 0) {
        parts.push(contact.join(" | "));
      }
      parts.push("");
      
      // Summary
      if (data.summary) {
        parts.push("PROFESSIONAL SUMMARY");
        parts.push("=".repeat(50));
        parts.push(data.summary);
        parts.push("");
      }
      
      // Experience
      if (data.experiences && data.experiences.length > 0) {
        parts.push("PROFESSIONAL EXPERIENCE");
        parts.push("=".repeat(50));
        data.experiences.forEach(exp => {
          parts.push(`${exp.role.toUpperCase()}`);
          parts.push(`${exp.company} | ${exp.start} - ${exp.end || 'Present'}`);
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(achievement => {
              parts.push(`  • ${achievement}`);
            });
          }
          parts.push("");
        });
      }
      
      // Education
      if (data.education && data.education.length > 0) {
        parts.push("EDUCATION");
        parts.push("=".repeat(50));
        data.education.forEach(edu => {
          const degree = edu.degree ? `, ${edu.degree}` : "";
          parts.push(`${edu.school}${degree}`);
          parts.push(`${edu.start} - ${edu.end || ''}`);
          parts.push("");
        });
      }
      
      // Skills
      if (data.skills) {
        parts.push("SKILLS");
        parts.push("=".repeat(50));
        parts.push(data.skills);
      }
      
      return parts.join("\n");
    }
  },
  
  minimal: {
    name: "Minimal",
    description: "Simple, clean design with focus on content",
    format: (data) => {
      const parts = [];
      
      // Header
      parts.push(`${data.full_name}`);
      parts.push(`${data.target_title}`);
      const contact = [];
      if (data.email) contact.push(data.email);
      if (data.phone) contact.push(data.phone);
      if (data.location) contact.push(data.location);
      if (data.links) contact.push(data.links);
      if (contact.length > 0) {
        parts.push(contact.join(" • "));
      }
      parts.push("");
      
      // Summary
      if (data.summary) {
        parts.push("Summary");
        parts.push("─".repeat(30));
        parts.push(data.summary);
        parts.push("");
      }
      
      // Experience
      if (data.experiences && data.experiences.length > 0) {
        parts.push("Experience");
        parts.push("─".repeat(30));
        data.experiences.forEach(exp => {
          parts.push(`${exp.role}`);
          parts.push(`${exp.company} • ${exp.start} - ${exp.end || 'Present'}`);
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(achievement => {
              parts.push(`  ${achievement}`);
            });
          }
          parts.push("");
        });
      }
      
      // Education
      if (data.education && data.education.length > 0) {
        parts.push("Education");
        parts.push("─".repeat(30));
        data.education.forEach(edu => {
          const degree = edu.degree ? `, ${edu.degree}` : "";
          parts.push(`${edu.school}${degree}`);
          parts.push(`${edu.start} - ${edu.end || ''}`);
          parts.push("");
        });
      }
      
      // Skills
      if (data.skills) {
        parts.push("Skills");
        parts.push("─".repeat(30));
        parts.push(data.skills);
      }
      
      return parts.join("\n");
    }
  }
};

export const getTemplateNames = () => Object.keys(templates);
export const getTemplate = (name) => templates[name];
