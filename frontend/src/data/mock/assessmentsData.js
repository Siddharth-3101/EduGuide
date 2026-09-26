export const GLOBAL_ASSESSMENTS = [
  {
    id: 'asmt-python',
    skillId: 'SKL-0012',
    skillName: 'Python',
    title: 'Python Core & Concurrency Assessment',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 75,
    proctored: true,
    totalQuestions: 5,
    description: 'Validates mastery in Python data structures, memory management, generators, decorators, and asynchronous programming.',
    competencyFocus: ['Generators & Iterators', 'CPython GIL & Concurrency', 'Hash Table Internals', 'Asyncio Event Loop'],
    questions: [
      {
        id: 'py-q1',
        prompt: 'What happens under the hood when a Python generator function containing the yield keyword is invoked?',
        options: [
          { id: 'A', text: 'It executes the entire body immediately and returns a tuple.' },
          { id: 'B', text: 'It returns a generator iterator object without executing any code until __next__() is called.' },
          { id: 'C', text: 'It spawns a new OS-level thread to compute values asynchronously.' },
          { id: 'D', text: 'It raises a SyntaxError if not wrapped inside an asyncio event loop.' }
        ],
        correctAnswer: 'B',
        explanation: 'In Python, calling a function that contains yield returns a generator object. Code execution only begins when next() or a for loop iterates over it.'
      },
      {
        id: 'py-q2',
        prompt: 'How does the Global Interpreter Lock (GIL) in CPython affect multi-threaded CPU-bound programs?',
        options: [
          { id: 'A', text: 'It allows full parallel execution of CPU threads across multiple cores.' },
          { id: 'B', text: 'It serializes bytecode execution such that only one thread runs Python bytecode at a time, preventing true CPU parallelism.' },
          { id: 'C', text: 'It forces CPU threads to run on GPU acceleration cores.' },
          { id: 'D', text: 'It automatically converts multi-threaded programs to multi-process programs.' }
        ],
        correctAnswer: 'B',
        explanation: 'CPython uses the GIL for reference-counting memory safety, meaning only one thread can execute Python bytecode simultaneously.'
      },
      {
        id: 'py-q3',
        prompt: 'Which data structure in Python is implemented as an open-addressing hash table with amortized O(1) lookups?',
        options: [
          { id: 'A', text: 'list' },
          { id: 'B', text: 'tuple' },
          { id: 'C', text: 'dict' },
          { id: 'D', text: 'heapq' }
        ],
        correctAnswer: 'C',
        explanation: 'Python dicts and sets are implemented as hash tables with open addressing and perturbation strategies, yielding amortized O(1) lookup.'
      },
      {
        id: 'py-q4',
        prompt: 'What is the primary difference between deepcopy() and copy() in the standard copy module?',
        options: [
          { id: 'A', text: 'copy() duplicates compound objects recursively, while deepcopy() duplicates shallow references.' },
          { id: 'B', text: 'deepcopy() duplicates compound objects and recursively duplicates all objects nested within them.' },
          { id: 'C', text: 'copy() only works on immutable datatypes like tuples and strings.' },
          { id: 'D', text: 'deepcopy() converts objects into JSON strings before deserializing.' }
        ],
        correctAnswer: 'B',
        explanation: 'Shallow copy constructs a new compound object and inserts references to existing elements; deep copy constructs a new object and recursively inserts copies of found elements.'
      },
      {
        id: 'py-q5',
        prompt: 'In asyncio, what does the keyword await do when encountered on a coroutine?',
        options: [
          { id: 'A', text: 'It freezes the entire operating system thread until an interrupt fires.' },
          { id: 'B', text: 'It yields control back to the event loop until the awaited task or future resolves.' },
          { id: 'C', text: 'It launches a child fork process using multiprocessing.Process.' },
          { id: 'D', text: 'It cancels all background tasks currently running in the loop.' }
        ],
        correctAnswer: 'B',
        explanation: 'await pauses execution of the current coroutine and hands control back to the asyncio event loop so other concurrent tasks can run.'
      }
    ]
  },
  {
    id: 'asmt-docker',
    skillId: 'SKL-0114',
    skillName: 'Docker',
    title: 'Docker & Containerization Practical Assessment',
    category: 'DevOps & Containers',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 80,
    proctored: true,
    totalQuestions: 5,
    description: 'Evaluates proficiency in multi-stage builds, container isolation, layer caching, volume persistence, and security.',
    competencyFocus: ['Multi-stage Builds', 'Layer Caching', 'Ephemeral Storage & Volumes', 'Security & Non-root Users'],
    questions: [
      {
        id: 'dk-q1',
        prompt: 'Why should build dependencies (e.g. gcc, build-essential, header files) be kept inside a separate build stage in multi-stage Dockerfiles?',
        options: [
          { id: 'A', text: 'Docker crashes if build compilers are kept in the final image.' },
          { id: 'B', text: 'Separating build stages drastically reduces the final runtime image size and removes unnecessary compiler attack surfaces.' },
          { id: 'C', text: 'Multi-stage builds are required to publish images to Docker Hub.' },
          { id: 'D', text: 'To ensure containers automatically run with kernel root capabilities.' }
        ],
        correctAnswer: 'B',
        explanation: 'Multi-stage builds leave compiler tools in the build container and copy only compiled binaries or wheels to the lean runtime image.'
      },
      {
        id: 'dk-q2',
        prompt: 'Which Docker instruction is used to define an immutable container user instead of the default root user for production security?',
        options: [
          { id: 'A', text: 'EXPOSE' },
          { id: 'B', text: 'USER nonroot' },
          { id: 'C', text: 'ENV ROOT=false' },
          { id: 'D', text: 'HEALTHCHECK' }
        ],
        correctAnswer: 'B',
        explanation: 'The USER directive specifies the UID/username for subsequent RUN, CMD, and ENTRYPOINT commands, preventing container breakout exploits from obtaining host root.'
      },
      {
        id: 'dk-q3',
        prompt: 'In Docker layer caching, how should instructions in a Dockerfile be ordered for maximum cache reuse during application code edits?',
        options: [
          { id: 'A', text: 'Place frequently changing application code (COPY . .) before dependency installation (COPY requirements.txt && pip install).' },
          { id: 'B', text: 'Place rarely changing dependencies and library installations before copying volatile application source files.' },
          { id: 'C', text: 'All RUN commands must be placed in random order to invalidate stale caches.' },
          { id: 'D', text: 'Place EXPOSE and ENTRYPOINT at the very beginning of the Dockerfile.' }
        ],
        correctAnswer: 'B',
        explanation: 'Docker invalidates all subsequent layer caches as soon as an instruction changes. Placing dependency installation before application code prevents re-downloading dependencies on every code change.'
      },
      {
        id: 'dk-q4',
        prompt: 'What happens to data stored in a Docker container if the container is stopped and removed without a mapped volume or bind mount?',
        options: [
          { id: 'A', text: 'Data is automatically mirrored to Docker Hub.' },
          { id: 'B', text: 'Data stored in the writable container layer is permanently lost upon removal.' },
          { id: 'C', text: 'Data is automatically backed up to /var/log/docker.bak.' },
          { id: 'D', text: 'Data persists permanently in the host memory swap.' }
        ],
        correctAnswer: 'B',
        explanation: 'Container writable layers are ephemeral and destroyed upon container removal. Persistent data must reside in Docker volumes or bind mounts.'
      },
      {
        id: 'dk-q5',
        prompt: 'What is the key difference between CMD and ENTRYPOINT in a Dockerfile?',
        options: [
          { id: 'A', text: 'CMD cannot take arguments while ENTRYPOINT can.' },
          { id: 'B', text: 'ENTRYPOINT defines the fixed executable process, while CMD provides default arguments that can be overridden at runtime.' },
          { id: 'C', text: 'CMD runs during docker build, while ENTRYPOINT runs during docker push.' },
          { id: 'D', text: 'ENTRYPOINT is only available in Docker Enterprise editions.' }
        ],
        correctAnswer: 'B',
        explanation: 'ENTRYPOINT sets the default command that will always run, while CMD specifies default parameters that can be overridden via command-line arguments to docker run.'
      }
    ]
  },
  {
    id: 'asmt-sql',
    skillId: 'SKL-0047',
    skillName: 'SQL',
    title: 'Relational Database Design & Query Optimization',
    category: 'Databases',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 75,
    proctored: true,
    totalQuestions: 4,
    description: 'Tests indexing strategies, query execution plans, transactions, ACID properties, and JOIN efficiency.',
    competencyFocus: ['B-Tree Indexing Rules', 'Transaction Isolation Levels', 'EXPLAIN ANALYZE Costing', 'OLTP Optimization'],
    questions: [
      {
        id: 'sql-q1',
        prompt: 'When creating a composite B-Tree index on columns (tenant_id, created_at, status), which query CANNOT efficiently utilize this index?',
        options: [
          { id: 'A', text: 'WHERE tenant_id = 101 AND created_at > \'2026-01-01\'' },
          { id: 'B', text: 'WHERE tenant_id = 101 AND status = \'ACTIVE\'' },
          { id: 'C', text: 'WHERE created_at > \'2026-01-01\' AND status = \'ACTIVE\'' },
          { id: 'D', text: 'WHERE tenant_id = 101' }
        ],
        correctAnswer: 'C',
        explanation: 'Composite B-Tree indexes follow the leftmost prefix rule. A query filtering only on created_at and status without tenant_id cannot use the index efficiently.'
      },
      {
        id: 'sql-q2',
        prompt: 'What database phenomenon occurs when Transaction A reads a row, Transaction B updates that row and commits, and Transaction A reads it again seeing the modification?',
        options: [
          { id: 'A', text: 'Dirty Read' },
          { id: 'B', text: 'Non-Repeatable Read' },
          { id: 'C', text: 'Phantom Read' },
          { id: 'D', text: 'Deadlock Collision' }
        ],
        correctAnswer: 'B',
        explanation: 'A Non-Repeatable Read occurs when a transaction reads the same row twice and observes changed values committed by another concurrent transaction.'
      },
      {
        id: 'sql-q3',
        prompt: 'What does the EXPLAIN ANALYZE command in PostgreSQL provide that plain EXPLAIN does not?',
        options: [
          { id: 'A', text: 'It automatically creates missing indexes on the table.' },
          { id: 'B', text: 'It actually executes the query and returns exact runtime execution time and actual row counts versus planner estimates.' },
          { id: 'C', text: 'It decompiles table schema into C code.' },
          { id: 'D', text: 'It encrypts query parameters with AES-256.' }
        ],
        correctAnswer: 'B',
        explanation: 'Plain EXPLAIN only generates the planner cost estimates. EXPLAIN ANALYZE executes the statement and reveals actual execution time and rows processed at each plan node.'
      },
      {
        id: 'sql-q4',
        prompt: 'Why should SELECT * be avoided in high-throughput production OLTP services?',
        options: [
          { id: 'A', text: 'SELECT * crashes database connection pools.' },
          { id: 'B', text: 'It causes unnecessary network and memory serialization overhead and prevents index-only covering scans.' },
          { id: 'C', text: 'SQL standards deprecated SELECT * in SQL:2016.' },
          { id: 'D', text: 'It forces database tables into exclusive write locks.' }
        ],
        correctAnswer: 'B',
        explanation: 'SELECT * fetches unneeded columns (including large TEXT/JSON/BLOBs) and prevents the database from performing index-only scans without accessing the heap.'
      }
    ]
  },
  {
    id: 'asmt-rest',
    skillId: 'SKL-0041',
    skillName: 'REST API',
    title: 'RESTful Architecture & HTTP Protocol Standards',
    category: 'Backend Architecture',
    difficulty: 'Intermediate',
    durationMinutes: 12,
    passingScore: 75,
    proctored: true,
    totalQuestions: 4,
    description: 'Covers HTTP status codes, idempotency, caching headers, rate limiting, and contract security.',
    competencyFocus: ['HTTP Method Idempotency', 'Semantic Status Codes', 'Rate Limiting Standards', 'ETags & Conditional Caching'],
    questions: [
      {
        id: 'rest-q1',
        prompt: 'Which of the following HTTP methods are defined as idempotent according to the RFC 9110 specification?',
        options: [
          { id: 'A', text: 'POST, PATCH, and CONNECT' },
          { id: 'B', text: 'GET, PUT, DELETE, and HEAD' },
          { id: 'C', text: 'POST and DELETE only' },
          { id: 'D', text: 'None of the HTTP methods are idempotent.' }
        ],
        correctAnswer: 'B',
        explanation: 'Idempotent methods can be called multiple times with the exact same side effects as a single invocation. GET, HEAD, PUT, and DELETE are idempotent.'
      },
      {
        id: 'rest-q2',
        prompt: 'Which HTTP status code should be returned when a client sends valid syntax but violates business domain rules (e.g. attempting to withdraw more funds than current balance)?',
        options: [
          { id: 'A', text: '400 Bad Request' },
          { id: 'B', text: '422 Unprocessable Content' },
          { id: 'C', text: '500 Internal Error' },
          { id: 'D', text: '404 Not Found' }
        ],
        correctAnswer: 'B',
        explanation: '422 Unprocessable Content represents well-formed syntax that contains semantic or domain validation errors.'
      },
      {
        id: 'rest-q3',
        prompt: 'What HTTP response header should an API Gateway send when a client exceeds rate limit thresholds along with a 429 Too Many Requests response?',
        options: [
          { id: 'A', text: 'Retry-After' },
          { id: 'B', text: 'Cache-Control' },
          { id: 'C', text: 'Content-Encoding' },
          { id: 'D', text: 'Upgrade-Insecure-Requests' }
        ],
        correctAnswer: 'A',
        explanation: 'The Retry-After header indicates how long the client should wait before making subsequent requests after receiving 429.'
      },
      {
        id: 'rest-q4',
        prompt: 'What is the role of an ETag (Entity Tag) HTTP header in RESTful resource caching?',
        options: [
          { id: 'A', text: 'It encrypts the payload using symmetric HMAC keys.' },
          { id: 'B', text: 'It is a unique fingerprint validator of the resource representation used for conditional requests (If-None-Match) to return 304 Not Modified.' },
          { id: 'C', text: 'It tells search engines to index the API endpoint.' },
          { id: 'D', text: 'It specifies user session cookies.' }
        ],
        correctAnswer: 'B',
        explanation: 'ETags allow clients and CDNs to validate cached content via conditional HTTP GET headers without re-downloading unchanged payload bodies.'
      }
    ]
  }
];

export const getAssessmentById = (id) => {
  return GLOBAL_ASSESSMENTS.find((a) => a.id === id || a.skillId === id || a.id === `asmt-${id}` || a.id === `asm-${id}`) || null;
};
