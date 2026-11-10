# Setup Guide: Room Booking (step by step)

This guide takes you from a new device (Windows, macOS or Linux) to a working, verified copy of the
`room-booking` training repo. Do the parts in order and tick each box as you go.
Each step shows **what you should see**. If you see something else, check
[Troubleshooting](#troubleshooting) at the end before moving on.

> **Golden rule:** Parts 0–5 do not change any source code or commits. Commits only
> happen in Part 6, on your own branch.
> If a command tells you files were modified and you didn't mean to modify them,
> stop and ask your trainer.

---

## Part 0 — Prepare a new device (once per machine)

### 0.1 Install Node, Git and npm

npm comes with Node; the third command updates it to the latest version.

**Windows** (PowerShell):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
npm install -g npm@latest
```

**macOS** (needs [Homebrew](https://brew.sh)):

```bash
brew install node
brew install git
npm install -g npm@latest
```

**Linux** (Ubuntu/Debian):

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g npm@latest
```

> Close and reopen the terminal after installing, otherwise `node`/`git` are "not recognized".
> **Windows:** if `npm` says *"running scripts is disabled"*, run
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then try again.

### 0.2 Check the versions

```bash
node -v
npm -v
git --version
```

What you should see (higher is fine):

```text
v20.x.x            <- must be 20 or newer
10.x.x
git version 2.x.x
```

### 0.3 Configure Git (first time on this device)

Tell Git who you are; this goes into every commit you make (for example, your homework):

```powershell
git config --global user.name "Your Full Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

Check: `git config --global --list` shows your name and email.

You'll also need a **GitHub account** (or whatever Git server your trainer uses) to push
your homework. Your trainer will give you the repository URL.

- [ ] Device ready: tools installed, versions checked, Git configured.

---

## Part 1 — Get the project and check Git

### 1.1 Get the code

Your trainer gives you the project folder (zip, USB drive or shared drive).
Copy the **whole** folder, including the hidden `.git` folder. Without `.git` the folder is
not a Git repository. Do **not** copy `node_modules` or `dist` from another machine;
delete them if they came along.

> Avoid putting the project inside OneDrive / Google Drive synced folders. Syncing can lock
> files while `npm install` runs.

### 1.2 Go to the project folder

The project is the folder that contains `package.json` and a hidden `.git` folder.

```powershell
cd C:\Users\<you>\Downloads\room-booking\room-booking
dir
```

You should see: `data`, `demos`, `scripts`, `src`, `bookings.json`, `package.json`,
`README.md`, `rooms.json`, `tsconfig.json` ...

> If you unzipped the repo, you may have **two** nested `room-booking` folders.
> Use the inner one, the one with `package.json` in it.

Open it in VS Code: `code .`

### 1.3 Check the Git history

```powershell
git log --oneline
```

What you should see: one commit.

```text
1a2b3c4 Initial commit
```

- [ ] `git log` shows the `Initial commit` and no error.

---

## Part 2 — Install packages and build

### 2.1 Install the dependencies

```powershell
npm install
```

This reads `package-lock.json` and creates a `node_modules` folder with TypeScript, `tsx`
and the Node type definitions, plus native binaries for **your** OS (so never copy `node_modules` from another computer).
You should end with a line like `added N packages ... found 0 vulnerabilities`.

> Want *exactly* the locked versions with a fresh `node_modules`? Use `npm ci` instead.
> Don't add `--omit=optional` or `--ignore-scripts`; the native binaries need them.

### 2.2 Check the project tools

```powershell
npx tsc -v
npx tsx --version
```

What you should see:

```text
Version 7.0.2
tsx v4.23.15
node v20.x.x (or newer)
```

- [ ] Both commands print a version. No `could not determine executable` or `Cannot find module` errors.

### 2.3 Type-check

```powershell
npm run check
```

This runs `tsc --noEmit`: it checks every `.ts` file in `src` for type errors without writing
any output.

- [ ] The command finishes and prints **no** `error TS...` lines.

### 2.4 Build (compile TypeScript to JavaScript)

```powershell
npm run build
```

This runs `tsc`, which compiles everything in `src` into `dist` (same folder layout).

- [ ] The command finishes and prints **no** `error TS...` lines.
- [ ] A `dist` folder now exists, with `main.js`, `models.js`, `report.js`, `repository.js`,
      `storage.js` and the `demo` and `lab` folders inside.

---

## Part 3 — The main demo (the app)

The app reads `rooms.json` and `bookings.json`, prints the bookings for 2026-11-12,
adds up revenue from confirmed bookings, and warns about overlapping bookings.

Symbols: `✔` confirmed · `○` pending · `✖` cancelled · `⚠` overlap warning.

### 3.1 Reset the data

```powershell
npm run reset
```

You should see: `bookings.json has been reset to the original data.`

### 3.2 Run the app

```powershell
npm start
```

What you should see:

```text
Bookings for 2026-11-12 (5)
  ✔ 09:00-11:00  Sky    Liam   400,000 VND
  ✔ 10:00-12:00  Sky    Minh   400,000 VND  ⚠ overlaps Liam
  ○ 13:00-14:00  Ocean  Lan    150,000 VND
  ✔ 14:00-17:00  Forest Huy    900,000 VND
  ✖ 15:00-16:00  Ocean  An     150,000 VND
Revenue (confirmed): 1,700,000 VND
⚠ 1 conflict(s) found
```

- [ ] 5 bookings · revenue **1,700,000 VND** · **1 conflict** (Minh overlaps Liam).

### 3.3 Add a booking from the command line

Format: `npm start -- <customer> <room> <start hour> <hours>`

```powershell
npm start -- Trang Ocean 16 2
```

What you should see (first two lines and last two lines):

```text
+ Booked: Ocean 16:00-18:00 for Trang
Saved 6 bookings to bookings.json
...
Revenue (confirmed): 2,000,000 VND
⚠ 1 conflict(s) found
```

- [ ] Trang is added · revenue **2,000,000 VND**.

### 3.4 Add an overlapping booking

```powershell
npm start -- Khoa Sky 9 1
```

What you should see:

```text
+ Booked: Sky 09:00-10:00 for Khoa
Saved 7 bookings to bookings.json
...
  ✔ 09:00-10:00  Sky    Khoa   200,000 VND  ⚠ overlaps Liam
Revenue (confirmed): 2,200,000 VND
⚠ 2 conflict(s) found
```

- [ ] Khoa is added with **"overlaps Liam"** · revenue **2,200,000 VND** · **2 conflict(s) found**.

The app only *warns* about overlaps. It doesn't block them yet; that's the homework.

### 3.5 Reset again

```powershell
npm run reset
```

- [ ] `bookings.json` is back to the original 5 bookings.

---

## Part 4 — The other demos

Run each one, and **predict the output before you press Enter**. That's the point of
these demos. The slide numbers match the table in `README.md`.

### 4.1 JavaScript demos

| Command | Slide | What it shows | What you should see |
| --- | --- | --- | --- |
| `npm run demo:js` | 6 | Three things about JavaScript | `Hi from Node.js`, then `x is now: five (string)`, then `[ 'Sky', 'Ocean' ]` |
| `npm run demo:bug` | 7 | The "400 billion" bug | `400000900000 string` (a number plus a string gives a string) |

### 4.2 TypeScript demos

These are about **type errors**, so most of the work happens in the editor. Make one change
at a time (see the "Try" column), look at the red underline in VS Code, run `npm run check` to
see the same error in the terminal, then undo the change.

| File (and command) | Slide | What it shows | What you should see as-is | Try |
| --- | --- | --- | --- | --- |
| `src/demo/types.ts` | 9 | TypeScript as a spell-checker; types disappear after build | `npm run check` passes. After `npm run build`, `dist\demo\types.js` has no `: number` left | Uncomment `addRevenue(400000, "900000")` |
| `src/demo/booking.ts` (`npm run demo:booking`) | 10 | Describing data: union, enum, required fields, `undefined` | `No booking with id bk9` | The 4 changes listed at the top of the file, or uncomment `console.log(found.customer)` |
| `src/demo/private.ts` (`npm run demo:private`) | 11 | `private` and generics: `Repository<Room>` vs `Repository<Booking>` | `1 room, 1 booking` | Add `bookingRepo.items = [];` (`'items' is private`), or `bookingRepo.add(roomRepo.getAll()[0]);` (a `Room` is not a `Booking`) |

- [ ] After undoing your changes, `npm run check` prints no errors again.

### 4.3 Node runtime labs

| Command | Slide | What it shows | What you should see |
| --- | --- | --- | --- |
| `npm run lab:thread` | 16 | One thread: nothing interrupts a running function | see [below](#labthread-runs-forever) |
| `npm run lab:wait` | 17 | Waiting is handed to libuv | `A: ask to read a file`, `B: do other work`, then `C: file is ready` (C comes **last**) |
| `npm run lab:queue` | 18 | Results wait for V8 to be free | about a 1 s pause, then `1: synchronous code done`, then `2: timer, 0 ms` |
| `npm run lab:parallel` | 19 | Waiting is parallel, computing isn't | `A. 3 waits, one by one: ~3s`, `B. 3 waits, together: ~1s`, `C. 3 computations, together: ~3s` |
| `npm run lab:promise` | 20 | A Promise is a placeholder for a later result | `1: Promise { <pending> }`, `2: the rest of the code keeps going`, then after about 1 s `3: Promise { '5 bookings' } -> 5 bookings` |
| `npm run lab:pending` | 20 | Forgetting `await` | `Without await: Promise { <pending> }`, then `With await: 5 bookings` |
| `npm run lab:await` | 21 | `await` pauses only the function, not the program | `A`, `B`, then `C` (after 0.3 s), then `D` (after 1 s) |
| `npm run lab:fail` | 22 | Caught vs. uncaught rejection | lines `1.`, `2.`, `3.`, then an `Error: bookings.json not found` stack trace (**expected**) |
| `npm run lab:nocatch` | 23 | A file error with no `try/catch` | `Reading missing.json...`, then `Error: ENOENT: no such file or directory` (**expected**) |
| `npm run lab:order` | backup | Promises run before timers | `1`, `4`, `3`, `2` |

> `lab:fail` and `lab:nocatch` **crash on purpose** to show what an unhandled error looks like.
> npm may add `npm error ... exit code 1` lines at the end. That is fine.

### Slide 23: how the app handles errors

After `lab:nocatch`, try these with the real app, one at a time, then run `npm run reset`:

| Change | What `npm start` does |
| --- | --- |
| Rename `bookings.json` | `No bookings.json yet, starting empty.` then `Bookings for 2026-11-12 (0)` |
| Break the JSON (e.g. delete a `}`) in `bookings.json` | `Something went wrong: ...` with a JSON parse message |
| Change `"start": 9` to `"start": "9"` in `bookings.json` | No error, but a wrong time like `09:00-92:00` (homework question 1) |

> Renamed the file? Rename it back to `bookings.json` (or just run `npm run reset`, which
> recreates it).

### `lab:thread` runs forever

```powershell
npm run lab:thread
```

You should see `tick` a few times, then `Heavy work, 2 seconds...`.
**No ticks for 2 seconds**, then `Done`, then the ticks start again.
After about 4 seconds, press **Ctrl+C** to stop it. If you're asked
`Terminate batch job (Y/N)?`, type `Y`.

- [ ] All demos in 4.1–4.3 ran and the output matched the tables.
- [ ] `npm run reset` was run at the end, so `bookings.json` has the original 5 bookings.

---

## Part 5 — Day-to-day commands (cheat sheet)

| Command | What it does |
| --- | --- |
| `npm run dev` | Run `src/main.ts` directly with `tsx` (no build step; use while coding) |
| `npm run dev -- Name Room Start Hours` | Same, and add a booking |
| `npm run check` | Type-check all of `src` without writing `dist/` |
| `npm run build` | Compile `.ts` to `.js` into `dist/` |
| `npm start` | Run the compiled app (`dist/main.js`) |
| `npm start -- Name Room Start Hours` | Add a booking, e.g. `npm start -- Trang Ocean 16 2` |
| `npm run reset` | Put `bookings.json` back to the 5 original bookings |

Rooms: `Sky` (200,000/h), `Ocean` (150,000/h), `Forest` (300,000/h).

When you're ready for the homework, see **"Homework"** in `README.md`. To commit and push your
work, follow [Part 6](#part-6--git-workflow-config-branch-stage-by-feature-commit-push).

---

## Part 6 — Git workflow: config, branch, stage by feature, commit, push

This part starts from a machine where Git is **not configured yet** and walks through the
whole flow once:

```text
config  →  checkout a branch  →  stage files (one feature)  →  commit (your message)  →  push
                                  ↑__________ repeat for each feature __________|
```

You don't commit after every small edit. You group the changed files **by feature** and make
one commit per feature, with a message you write yourself.

### 6.1 Configure Git (once per machine)

Check what is set:

```powershell
git config --global --list
```

If `user.name` or `user.email` is missing, set them. They go into every commit:

```powershell
git config --global user.name "Your Full Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

- [ ] `git config --global --list` now shows your name and email.

### 6.2 Check out a branch

Never work directly on `main`. Create a branch for your work and switch to it:

```powershell
git checkout -b feature/<short-name>
```

Example: `git checkout -b feature/booking-rules`

The branch already exists? Switch to it without `-b`: `git checkout feature/booking-rules`

Check: `git branch` shows `* feature/<short-name>` (the `*` marks the current branch).

### 6.3 See what changed

```powershell
git status
```

- `Changes not staged for commit`: files you modified.
- `Untracked files`: new files Git doesn't know yet.

`dist` and `node_modules` are git-ignored, so they never appear here. Don't commit them.

To see the exact lines changed in one file: `git diff src/main.ts`

### 6.4 Stage the files of one feature

Pick **only the files that belong to one feature**, for example "overlap check":

```powershell
git add src/report.ts src/main.ts
git status
```

- [ ] Under `Changes to be committed` you see only that feature's files. Other files stay in
      `Changes not staged` and wait for their own commit.

Picked a wrong file? Take it out (your edits to the file are kept):

```powershell
git restore --staged <file>
```

> A file has changes for **two** features? `git add -p <file>` asks you about each changed
> block: `y` stages it, `n` leaves it for later.
>
> Prefer clicking? In VS Code open **Source Control** (`Ctrl+Shift+G`) and click **`+`** next to
> each file to stage it.

### 6.5 Commit with your own message

```powershell
git commit -m "Block overlapping bookings in the same room"
```

Write one short line that says **what this feature does**. For more detail, add a second `-m`:

```powershell
git commit -m "Block overlapping bookings in the same room" -m "Shows an error instead of saving the booking."
```

What you should see: `[feature/<short-name> 1a2b3c4] Block overlapping ...` and `N files changed`.

**Next feature?** Go back to 6.4, stage its files, and commit again. Example with two features:

```powershell
git add src/report.ts src/main.ts
git commit -m "Block overlapping bookings in the same room"

git add src/repository.ts
git commit -m "Add cancel booking command"
```

Check: `git log --oneline -5` shows one commit per feature, newest on top.

> Typo in the message, or forgot a file? If you **haven't pushed yet**, run `git add <file>`
> if needed, then `git commit --amend -m "New message"`. It replaces your last commit.

### 6.6 Push

First time only, connect the folder to the remote repository. `git remote -v` shows what is set;
skip this if it already lists `origin`:

```powershell
git remote add origin <repository-URL>
```

Push the branch:

```powershell
git push -u origin feature/<short-name>
```

`-u` links your local branch to the remote one, so later pushes are just `git push`.
The first push may open a browser window to sign in.

- [ ] The push ends with `* [new branch] feature/<short-name> -> feature/<short-name>`.

Then open a Pull Request from `feature/<short-name>` into `main` on GitHub.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node` / `npm` / `git` *is not recognized* | Tool not installed, or the terminal was opened before the install. Close **all** terminals and VS Code and reopen. If it still fails, reinstall and keep "Add to PATH" checked. |
| `npm : ... running scripts is disabled on this system` | PowerShell blocks `npm.ps1`. Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then reopen the terminal. (Or use `npm.cmd` instead of `npm`.) |
| `fatal: detected dubious ownership in repository` | The folder was copied or unzipped from another user. Run the `git config --global --add safe.directory ...` command that the error message suggests. |
| `npm start -- Trang Ocean 16 2` doesn't add a booking in PowerShell | PowerShell can swallow the `--`. Quote it: `npm start '--' Trang Ocean 16 2`, or use Command Prompt or Git Bash. |
| `Unknown room: ...` | Room names are case-sensitive: `Sky`, `Ocean`, `Forest`. |
| `start and hours must be whole numbers` | Use whole hours, e.g. `16 2`, not `16:00` or `2.5`. |
| Revenue or conflicts don't match this guide | Earlier runs added bookings. Run `npm run reset` and try again. |
| `✔ ○ ✖ ⚠` show as `?` or boxes | Your console font is missing these symbols. Use Windows Terminal or the VS Code terminal. The app itself is fine. |
| `git checkout <branch>` says *your local changes would be overwritten* | Commit your changes first, or run `npm run reset` if only `bookings.json` changed, then try again. |
| `Cannot find module ... dist/main.js` | You haven't built yet. Run `npm run build`. |
| `npm start` doesn't show your latest code change | `npm start` runs the old `dist`. Run `npm run build` first, or use `npm run dev`. |
| `npm run check` / `build` shows `error TS...` in `src/demo/` | A demo change is still in place. Undo it (Part 4.2). |
| `lab:fail` or `lab:nocatch` ends with an error and `exit code 1` | Expected: these labs crash on purpose (Part 4.3). |
| `No bookings.json yet, starting empty.` | `bookings.json` was renamed or deleted. Run `npm run reset`. |
| `Something went wrong: ... in JSON at position ...` | `bookings.json` is broken. Run `npm run reset`. |
| `npm install` hangs, or fails with `ETIMEDOUT` / `ECONNRESET` / `self-signed certificate` | Company network or proxy. Ask IT whether `registry.npmjs.org` is blocked. |
| `EBADENGINE` / `Unsupported engine` warning | Node is older than 20. Install Node LTS (0.1) and reopen the terminal. |
| `tsc` or `tsx` fails with *"could not find package @typescript/typescript-..."* or *"esbuild ... another platform"* | `node_modules` came from another OS, or optional packages were skipped. Delete `node_modules` and run `npm install` again on this device. |
| `EPERM` / `EBUSY` during `npm install` on Windows | Antivirus or OneDrive is locking files. Close VS Code, move the project out of a synced folder, and try again. |
| `node -p "process.arch"` prints `ia32` | 32-bit Node. Uninstall it and install the 64-bit Node LTS. |
| `Please tell me who you are` when committing | Do 6.1 (`git config --global user.name / user.email`). |
| `nothing added to commit` | You didn't stage any file. Do 6.4 (`git add <file>`) first. |
| `fatal: 'origin' does not appear to be a git repository` | No remote yet. Run `git remote add origin <repository-URL>` (6.6). |
| `remote origin already exists` | The remote is already set. Skip that command and just `git push`. |
| `! [rejected] ... (fetch first)` when pushing | The remote branch has commits you don't have. Run `git pull --rebase`, then `git push` again. |
| `Authentication failed` / `Permission denied` when pushing | Sign in again (the browser window), or ask your trainer to give your account access to the repository. |
| `fatal: not a git repository` | The hidden `.git` folder wasn't copied. Get the full folder again from your trainer. |
| `git log` says *your current branch ... does not have any commits yet* | Someone ran `git init` in a folder without the original `.git`, so the history is gone. Delete that `.git` folder and get the full folder again from your trainer. |

**macOS / Linux users:** every command works the same in Terminal. Use `ls` instead of `dir`,
and `rm -rf dist` / `rm -rf node_modules` to delete those folders.
