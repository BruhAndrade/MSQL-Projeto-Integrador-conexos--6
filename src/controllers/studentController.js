// ESSA PARTE FAZ PARTE DO OBJETO DE ESTUDO
import studentRepository from "../repositories/studentRepository.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class StudentController {
	async login(req, res) {
		try {
		// Obtém as informações de email e senha do corpo da solicitação.
			const { email, password } = req.body;
		// Procura por um estudante com o email fornecido no repositório de estudantes.
			const student = await studentRepository.getOne({
				where: { email: email },
			});
		// Verifica se o estudante existe e se a senha fornecida corresponde à senha armazenada no banco de dados.
			if (student && (await bcrypt.compare(password, student.password))) {
		// Se as credenciais estiverem corretas, gera um token JWT para autenticar o usuário.
				const token = jwt.sign(
					{ student_id: student.id, email },
					process.env.TOKEN_KEY,
					{
						expiresIn: "5h",// Define um tempo de expiração para o token (5 horas neste caso).
					}
				);

				// res.cookie("jwt", token);
			// Retorna o token como resposta para o cliente.
				return res.status(200).json({ token: token });
			}
			// Se as credenciais não estiverem corretas, retorna um erro de autenticação.
			res.status(400).json({ error: "Credenciais inválidas." });
		} catch (error) {
			// Em caso de erro, retorna uma resposta de erro genérica.
			res.status(500).json({ error: error.message });
		}
	}

	async create(req, res) {
		try {
		// Cria um novo estudante com os dados fornecidos no corpo da solicitação.
			const student = await studentRepository.create(req.body);
			const { name, age, course, department, email, password } = req.body;
		
        // Verifica se já existe um estudante com o mesmo endereço de e-mail.
			const oldStudent = await studentRepository.getOne({
				where: { email: email },
			});
		// Se um estudante com o mesmo e-mail já existir, retorna um erro de conflito.
			if (oldStudent) {
				return res
					.status(409)
					.json({ error: "Estudante já cadastrado. Faça o login." });
			}

		// Gera um hash da senha do estudante para armazenamento seguro no banco de dados.
			const salt = 10;
			const encryptedStudentPassword = await bcrypt.hash(password, salt);
		// Cria o estudante com os dados fornecidos, incluindo a senha criptografada.
			const student = await studentRepository.create({
				name: name,
				age: age,
				course: course,
				department: department,
				email: email.toLowerCase(),
				password: encryptedStudentPassword,
			});

			const token = jwt.sign(
				{ student_id: student.id, email },
				process.env.TOKEN_KEY,
				{ expiresIn: "5h" }
			);

			res.cookie("jwt", token);

			res.status(201).json(student);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	async getAll(req, res) {
		try {
			const students = await studentRepository.getAll();
			res.json(students);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	async getById(req, res) {
		try {
			const student = await studentRepository.getById(req.params.id);
			if (!student) {
				return res.status(404).json({ error: "Estudante não encontrado" });
			}
			res.json(student);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	async update(req, res) {
		try {
			const [affectedRows, student] = await studentRepository.update(
				req.params.id,
				req.body
			);
			if (!affectedRows || affectedRows == 0) {
				return res.status(500).json({
					error: `Não foi possível atualizar o estudante com id: ${req.params.id}`,
				});
			}
			if (!student) {
				return res.status(404).json({ error: "Estudante não encontrado" });
			}
			res.json(student);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
    async delete(req, res) {
		try {
			const destroyedRows = await studentRepository.delete(req.params.id);
			if (destroyedRows === 0) {
				return res.status(500).json({
					error: `Não foi possível excluir o estudante com id: ${req.params.id}`,
				});
			}
			res.json({ message: "Estudante excluído com sucesso" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
export default new StudentController();