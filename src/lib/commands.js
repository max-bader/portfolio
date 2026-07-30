import { projectsData } from '../data/projects';
import { experienceData } from '../data/experience';
import { socialLinks } from '../data/socialLinks';
import { accents } from './theme';

export const RESUME_URL = '/MaxBaderResume copy.pdf';
export const PAPER_URL = '/CoVeGAT (6).pdf';
export const EMAIL = 'mibader@uci.edu';

const line = (text = '', tone = 'default') => ({ text, tone });
const blank = () => line('');

const ASCII = [
  '  __  __              ',
  ' |  \\/  | __ ___  __  ',
  " | |\\/| |/ _` \\ \\/ /  ",
  ' | |  | | (_| |>  <   ',
  ' |_|  |_|\\__,_/_/\\_\\  '
];

/**
 * Every command the on-site terminal understands. `ctx` gives each one a way
 * to talk back to the UI: print lines, clear, close, open links, retheme.
 */
export const createCommands = (ctx) => {
  const commands = {
    help: {
      description: 'List everything this terminal knows',
      run: () => [
        line('Available commands', 'accent'),
        blank(),
        ...Object.entries(commands).map(([name, cmd]) =>
          line(`  ${name.padEnd(12)} ${cmd.description}`)
        ),
        blank(),
        line('Tab completes · ↑/↓ walks history · Esc closes', 'muted')
      ]
    },

    whoami: {
      description: 'The short version',
      run: () => [
        line('Max Bader', 'accent'),
        line('Computer Science @ UC Irvine'),
        line('Software Engineer Intern @ CodeHS'),
        blank(),
        line("Currently into: AI tooling, graph ML, and frontends that feel fast.", 'muted')
      ]
    },

    neofetch: {
      description: 'System info, portfolio edition',
      run: () => {
        const stats = [
          ['user', 'max@portfolio'],
          ['school', 'UC Irvine — Computer Science'],
          ['role', 'SWE Intern @ CodeHS'],
          ['roles', `${experienceData.length} logged`],
          ['projects', `${projectsData.length} shipped`],
          ['stack', 'React · TypeScript · Python · PyTorch'],
          ['uptime', 'caffeinated'],
          ['shell', 'portfolio-sh 1.0']
        ];
        return ASCII.map((art, i) => {
          const stat = stats[i];
          const right = stat ? `   ${stat[0].padEnd(9)} ${stat[1]}` : '';
          return line(`${art}${right}`, 'accent');
        }).concat(
          stats.slice(ASCII.length).map((stat) =>
            line(`${''.padEnd(22)}   ${stat[0].padEnd(9)} ${stat[1]}`)
          )
        );
      }
    },

    experience: {
      description: 'Where I have worked (add a name to filter)',
      run: (args) => {
        const query = args.join(' ').toLowerCase();
        const matches = query
          ? experienceData.filter(
              (job) =>
                job.company.toLowerCase().includes(query) ||
                job.id.includes(query)
            )
          : experienceData;

        if (!matches.length) {
          return [line(`No role matching "${args.join(' ')}"`, 'error')];
        }

        return matches.flatMap((job) => [
          line(`${job.company} — ${job.role}`, 'accent'),
          line(`  ${job.date}   ${job.url}`, 'muted'),
          ...(job.description ? [line(`  ${job.description}`)] : []),
          ...(job.skills.length ? [line(`  [ ${job.skills.join(' · ')} ]`, 'muted')] : []),
          blank()
        ]);
      }
    },

    projects: {
      description: 'Things I have built',
      run: () =>
        projectsData.flatMap((project, i) => [
          line(`${String(i + 1).padStart(2, '0')}  ${project.title}`, 'accent'),
          line(`    ${project.description}`),
          line(`    ${project.technologies.join(' · ')}`, 'muted'),
          line(`    ${project.githubUrl}`, 'muted'),
          blank()
        ])
    },

    open: {
      description: 'Open a project on GitHub — open <number|name>',
      run: (args) => {
        if (!args.length) {
          return [line('Usage: open <number|name>', 'error')];
        }
        const query = args.join(' ').toLowerCase();
        const project =
          projectsData[Number(query) - 1] ||
          projectsData.find((p) => p.title.toLowerCase().includes(query));

        if (!project) return [line(`No project matching "${args.join(' ')}"`, 'error')];

        ctx.openUrl(project.githubUrl);
        return [line(`Opening ${project.title}…`, 'success')];
      }
    },

    skills: {
      description: 'The stack, grouped',
      run: () => {
        const groups = [
          ['languages', 'TypeScript · JavaScript · Python · Java · SQL'],
          ['frontend', 'React · Next.js · Vite · Tailwind CSS · HTML/CSS'],
          ['backend', 'Node.js · Flask · FastAPI · Supabase · PostgreSQL'],
          ['ai/ml', 'PyTorch · TensorFlow · Hugging Face · scikit-learn · LLM eval'],
          ['tools', 'Git · Docker · Vercel · Figma · Postman']
        ];
        return groups.map(([name, list]) => line(`${name.padEnd(10)} ${list}`));
      }
    },

    resume: {
      description: 'Open my resume',
      run: () => {
        ctx.openUrl(RESUME_URL);
        return [line('Opening resume.pdf…', 'success')];
      }
    },

    paper: {
      description: 'Open CoVeGAT, my claim-verification paper',
      run: () => {
        ctx.openUrl(PAPER_URL);
        return [line('Opening CoVeGAT.pdf…', 'success')];
      }
    },

    contact: {
      description: 'How to reach me',
      run: () => [
        line(`email     ${EMAIL}`),
        ...socialLinks
          .filter((link) => !link.url.startsWith('mailto:'))
          .map((link) => line(`${link.name.toLowerCase().padEnd(10)}${link.url}`)),
        blank(),
        line('Run `email` to copy my address to the clipboard.', 'muted')
      ]
    },

    email: {
      description: 'Copy my email to the clipboard',
      run: () => {
        ctx.copy(EMAIL);
        return [line(`Copied ${EMAIL} to clipboard`, 'success')];
      }
    },

    goto: {
      description: 'Jump to a section — goto home|experience|projects',
      run: (args) => {
        const target = (args[0] || '').toLowerCase();
        const sections = ['home', 'experience', 'projects'];
        if (!sections.includes(target)) {
          return [line(`Usage: goto ${sections.join('|')}`, 'error')];
        }
        ctx.navigate(target);
        return [line(`Scrolling to #${target}…`, 'success')];
      }
    },

    theme: {
      description: `Recolor the site — theme ${accents.map((a) => a.id).join('|')}`,
      run: (args) => {
        const target = (args[0] || '').toLowerCase();
        if (!target) {
          return [
            line('Available themes', 'accent'),
            ...accents.map((a) => line(`  ${a.id.padEnd(10)} rgb(${a.base})`)),
            blank(),
            line('Usage: theme <name>', 'muted')
          ];
        }
        const match = accents.find((a) => a.id === target);
        if (!match) return [line(`Unknown theme "${target}"`, 'error')];

        ctx.setAccent(match.id);
        return [line(`Accent set to ${match.label}`, 'success')];
      }
    },

    appearance: {
      description: 'Switch the page between light and dark',
      run: (args) => {
        const target = (args[0] || '').toLowerCase();
        if (target !== 'light' && target !== 'dark') {
          return [line('Usage: appearance light|dark', 'error')];
        }
        ctx.setAppearance(target);
        return [line(`Switched to ${target} mode`, 'success')];
      }
    },

    matrix: {
      description: 'Follow the white rabbit',
      run: () => {
        ctx.matrix();
        return [line('Wake up, Neo…', 'success')];
      }
    },

    sudo: {
      description: 'Elevate privileges (good luck)',
      run: (args) => [
        line(`max is not in the sudoers file. This incident has been reported.`, 'error'),
        ...(args.length ? [line(`(you tried: sudo ${args.join(' ')})`, 'muted')] : [])
      ]
    },

    date: {
      description: "Today's date",
      run: () => [line(new Date().toString())]
    },

    echo: {
      description: 'Say it back',
      run: (args) => [line(args.join(' '))]
    },

    clear: {
      description: 'Clear the screen',
      run: () => {
        ctx.clear();
        return [];
      }
    },

    exit: {
      description: 'Close the terminal',
      run: () => {
        ctx.close();
        return [];
      }
    }
  };

  // Aliases keep muscle memory happy without cluttering `help`.
  const aliases = {
    about: 'whoami',
    ls: 'projects',
    work: 'projects',
    exp: 'experience',
    cv: 'resume',
    stack: 'skills',
    quit: 'exit',
    close: 'exit'
  };

  return { commands, aliases };
};

export const runCommand = (input, ctx) => {
  const { commands, aliases } = createCommands(ctx);
  const [rawName, ...args] = input.trim().split(/\s+/);
  const name = (aliases[rawName.toLowerCase()] || rawName).toLowerCase();
  const command = commands[name];

  if (!command) {
    return [
      line(`command not found: ${rawName}`, 'error'),
      line('Type `help` to see what works.', 'muted')
    ];
  }

  return command.run(args);
};

export const commandNames = () => {
  const { commands, aliases } = createCommands({
    openUrl: () => {},
    copy: () => {},
    navigate: () => {},
    setAccent: () => {},
    setAppearance: () => {},
    matrix: () => {},
    clear: () => {},
    close: () => {}
  });
  return [...Object.keys(commands), ...Object.keys(aliases)];
};
