class SchoolEthicsGame extends Phaser.Scene {
    constructor() {
        super();
        this.score = 0;
        this.currentScenario = 0;
        this.choiceTimer = 15; // 15 seconds for each choice
        this.gameStarted = false;
        this.savedGame = null;
        this.timerText = null;
        this.achievements = {
            firstChoice: false,
            perfectScore: false,
            speedRunner: false,
            thoughtful: false,
            consistent: false
        };
        this.achievementProgress = {
            goodChoicesStreak: 0,
            fastChoices: 0
        };
        this.player = null;
        this.statistics = {
            goodChoices: 0,
            badChoices: 0,
            totalTime: 0
        };
        this.startTime = 0;
        this.scenarios = [{
            question: "Você viu um colega deixando lixo no chão. O que você faz?",
            difficulty: 1, // Easy starter scenario
            options: [{
                text: "A) Ignorar",
                points: -10,
                feedback: "Não é legal ignorar! Devemos cuidar do ambiente."
            }, {
                text: "B) Pedir educadamente para ele jogar no lixo",
                points: 20,
                feedback: "Excelente! Você ajudou a manter a escola limpa."
            }, {
                text: "C) Recolher o lixo você mesmo e dar o exemplo",
                points: 15,
                feedback: "Bom! Você ajudou o ambiente, mas seria melhor conscientizar o colega também."
            }]
        }, {
            question: "Um colega está tendo dificuldade na tarefa. O que você faz?",
            difficulty: 1, // Easy scenario
            options: [{
                text: "A) Ajudar o colega",
                points: 20,
                feedback: "Ótimo! Ajudar os outros é muito importante!"
            }, {
                text: "B) Ignorar",
                points: -10,
                feedback: "Pense bem! Todos precisam de ajuda às vezes."
            }, {
                text: "C) Sugerir que ele procure o professor",
                points: 10,
                feedback: "Bom! Mas você mesmo poderia ter ajudado também."
            }]
        }, {
            question: "Você encontrou um material perdido. O que faz?",
            options: [{
                text: "A) Entregar para a professora",
                points: 20,
                feedback: "Parabéns! Honestidade é fundamental!"
            }, {
                text: "B) Guardar para si",
                points: -20,
                feedback: "Isso não é correto. Devemos ser honestos!"
            }, {
                text: "C) Perguntar na sala de quem é",
                points: 15,
                feedback: "Bom! Mas melhor entregar ao professor para evitar confusão."
            }]
        }, {
            question: "Durante uma prova, você percebe que seu colega está colando. O que você faz?",
            options: [{
                text: "A) Avisar discretamente ao professor",
                points: 20,
                feedback: "Correto! Honestidade acadêmica é muito importante."
            }, {
                text: "B) Ignorar a situação",
                points: -10,
                feedback: "Não é bom ignorar! A cola prejudica o aprendizado."
            }, {
                text: "C) Conversar com o colega depois da prova",
                points: 15,
                feedback: "Bom! Dialogar é importante, mas o professor deveria ser informado."
            }]
        }, {
            question: "Você vê alguns colegas zombando de um aluno novo. O que você faz?",
            options: [{
                text: "A) Defender o aluno novo e pedir que parem",
                points: 20,
                feedback: "Excelente! Defender quem está sendo intimidado é muito importante!"
            }, {
                text: "B) Fingir que não viu",
                points: -20,
                feedback: "Não devemos ignorar o bullying! Todos merecem respeito."
            }, {
                text: "C) Chamar um professor",
                points: 15,
                feedback: "Bom! Buscar ajuda é importante, mas você também pode se posicionar."
            }]
        }, {
            question: "Durante um trabalho em grupo, um colega não está participando. O que você faz?",
            options: [{
                text: "A) Conversar com ele sobre a importância da participação",
                points: 20,
                feedback: "Ótimo! Diálogo é sempre o melhor caminho!"
            }, {
                text: "B) Excluir ele do grupo",
                points: -20,
                feedback: "Exclusão não é a solução! Tente incluir e ajudar."
            }, {
                text: "C) Fazer a parte dele para evitar conflitos",
                points: -10,
                feedback: "Não é bom assumir o trabalho dos outros, incentive a participação!"
            }]
        }, {
            question: "Você percebe que seu amigo está muito triste hoje. O que você faz?",
            options: [{
                text: "A) Perguntar se ele está bem e oferecer apoio",
                points: 20,
                feedback: "Excelente! Empatia e cuidado com os outros são muito importantes!"
            }, {
                text: "B) Deixar ele sozinho",
                points: -10,
                feedback: "Às vezes as pessoas precisam de apoio mesmo quando não pedem!"
            }, {
                text: "C) Contar para outros colegas",
                points: -15,
                feedback: "Devemos respeitar a privacidade dos outros!"
            }]
        }, {
            question: "Você quebrou algo na escola sem querer. O que você faz?",
            options: [{
                text: "A) Comunicar imediatamente à direção",
                points: 20,
                feedback: "Parabéns! Assumir responsabilidade é muito importante!"
            }, {
                text: "B) Fingir que não foi você",
                points: -20,
                feedback: "Não é correto esconder nossos erros!"
            }, {
                text: "C) Esperar alguém descobrir",
                points: -15,
                feedback: "É melhor assumir logo do que esperar as consequências!"
            }]
        }, {
            question: "Durante uma discussão em sala, seu colega tem uma opinião diferente. O que você faz?",
            options: [{
                text: "A) Ouvir com respeito e dialogar",
                points: 20,
                feedback: "Excelente! Respeitar diferentes opiniões é fundamental!"
            }, {
                text: "B) Tentar impor sua opinião",
                points: -15,
                feedback: "Não devemos impor nossas opiniões aos outros!"
            }, {
                text: "C) Ignorar a opinião dele",
                points: -10,
                feedback: "É importante ouvir diferentes pontos de vista!"
            }]
        }, {
            question: "Você encontra um celular esquecido no pátio da escola. O que você faz?",
            options: [{
                text: "A) Levar para a secretaria imediatamente",
                points: 20,
                feedback: "Parabéns! Essa é a atitude mais correta!"
            }, {
                text: "B) Olhar as mensagens para descobrir o dono",
                points: -10,
                feedback: "Não devemos invadir a privacidade dos outros!"
            }, {
                text: "C) Deixar onde está",
                points: -15,
                feedback: "O celular pode ser perdido ou roubado se ficar ali!"
            }]
        }];
    }
    saveGame() {
        const gameState = {
            score: this.score,
            currentScenario: this.currentScenario,
            statistics: this.statistics,
            achievements: this.achievements,
            achievementProgress: this.achievementProgress
        };
        localStorage.setItem('schoolEthicsGame', JSON.stringify(gameState));
    }
    loadGame() {
        const savedState = localStorage.getItem('schoolEthicsGame');
        if (savedState) {
            this.savedGame = JSON.parse(savedState);
            return true;
        }
        return false;
    }
    create() {
        // Game initialization starts here
        if (!this.gameStarted) {
            this.showStartScreen();
            return;
        }

        if (this.savedGame) {
            this.score = this.savedGame.score;
            this.currentScenario = this.savedGame.currentScenario;
            this.statistics = this.savedGame.statistics;
            this.achievements = this.savedGame.achievements;
            this.achievementProgress = this.savedGame.achievementProgress;
            this.savedGame = null;
        }
        this.startTime = this.time.now;
        // Gradient background
        // Create an engaging background with gradient and pattern
        const background = this.add.graphics();
        background.fillGradientStyle(0xff1493, 0xff69b4, 0xffc0cb, 0xffb6c1, 1);
        background.fillRect(0, 0, this.scale.width, this.scale.height);

        // Add animated background particles
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const particle = this.add.star(x, y, 5, 2, 4, 0xffffff, 0.4);

            this.tweens.add({
                targets: particle,
                y: y - 150,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                scale: {
                    from: 1,
                    to: 0.5
                },
                rotation: {
                    from: 0,
                    to: 2 * Math.PI
                },
                repeat: -1,
                yoyo: true
            });
        }

        // Add decorative pattern
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 15; j++) {
                const circle = this.add.circle(i * 40, j * 40, 2, 0xffffff, 0.2);
            }
        }
        // Decorative elements
        const decorRect = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.15, this.scale.width * 0.9, this.scale.height * 0.2, 0xffffff, 0.2).setOrigin(0.5);
        this.tweens.add({
            targets: decorRect,
            alpha: {
                from: 0.2,
                to: 0.3
            },
            yoyo: true,
            duration: 2000,
            repeat: -1
        });
        this.add.rectangle(this.scale.width / 2, this.scale.height * 0.6, this.scale.width * 0.9, this.scale.height * 0.6, 0xffffff, 0.1).setOrigin(0.5);
        // Enhanced score display
        // Enhanced score display with animation
        const scoreContainer = this.add.rectangle(this.scale.width * 0.12, this.scale.height * 0.07, this.scale.width * 0.2, this.scale.height * 0.08, 0xffcc00, 0.3);
        scoreContainer.setStrokeStyle(2, 0xffcc00);
        // Add decorative elements to score display
        const scoreIcon = this.add.star(this.scale.width * 0.06, this.scale.height * 0.07, 5, 8, 15, 0xffcc00, 0.8);
        this.scoreText = this.add.text(this.scale.width * 0.12, this.scale.height * 0.07, 'Pontos: 0', {
            fontSize: '26px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                blur: 5,
                color: '#000000',
                fill: true
            }
        }).setOrigin(0.5);
        // Enhanced player representation
        const playerContainer = this.add.container(this.scale.width / 2, this.scale.height * 0.83);
        const playerBody = this.add.circle(0, 0, 20, 0xffffff);
        const playerOutline = this.add.circle(0, 0, 22, 0xff69b4);
        playerContainer.add([playerOutline, playerBody]);
        this.player = playerContainer;
        // Enhanced title
        const titleText = this.add.text(400, 50, 'Ética na Escola', {
            fontSize: '38px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        titleText.setShadow(2, 2, 'rgba(0,0,0,0.3)', 5);
        // Add progress bar
        this.progressBox = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.95, this.scale.width * 0.4, this.scale.height * 0.03, 0x000000, 0.2);
        this.progressBar = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.95, this.scale.width * 0.4, this.scale.height * 0.03, 0x00ff00, 0.8);
        this.progressBar.setOrigin(0.5);
        this.progressBox.setOrigin(0.5);
        this.updateProgressBar();
        // Add timer text
        this.timerText = this.add.text(400, 150, '', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.showScenario();
    }

    showScenario() {
        if (this.currentScenario >= this.scenarios.length) {
            this.showEndGame();
            return;
        }

        const scenario = this.scenarios[this.currentScenario];

        // Reset and start timer
        this.choiceTimer = 15;
        this.updateTimer();

        // Create timer event
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Limpa mensagens anteriores
        if (this.questionText && this.questionText.scene) {
            this.questionText.destroy();
        }
        if (this.optionContainers) {
            this.optionContainers.forEach(container => {
                if (container && container.scene) {
                    container.destroy();
                }
            });
        }
        if (this.feedbackText && this.feedbackText.scene) {
            this.feedbackText.destroy();
        }

        // Mostra a pergunta
        // Enhanced question display
        // Enhanced question display with animation
        const questionBox = this.add.rectangle(400, 200, 700, 80, 0xffffff, 0.95);
        questionBox.setStrokeStyle(3, 0x3b5998);

        // Add entrance animation for question
        questionBox.alpha = 0;
        questionBox.y = 150;
        this.tweens.add({
            targets: questionBox,
            alpha: 1,
            y: 200,
            duration: 500,
            ease: 'Power2'
        });
        this.questionText = this.add.text(400, 200, scenario.question, {
            fontSize: '26px',
            fill: '#000000',
            align: 'center',
            wordWrap: {
                width: 650
            },
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#ffffff',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Mostra as opções
        this.optionContainers = [];
        this.optionTexts = scenario.options.map((option, index) => {
            const optionY = 300 + (index * 80);
            const optionContainer = this.add.container(400, optionY);

            // Add entrance animation for options
            optionContainer.alpha = 0;
            optionContainer.x = 350;
            this.tweens.add({
                targets: optionContainer,
                alpha: 1,
                x: 400,
                duration: 500,
                delay: index * 100,
                ease: 'Power2'
            });
            this.optionContainers.push(optionContainer);

            // Create option box with enhanced styling
            const optionBox = this.add.rectangle(0, 0, 600, 50, 0xffffff, 0.9);
            optionBox.setStrokeStyle(2, 0x357abd);
            const optionText = this.add.text(0, 0, option.text, {
                fontSize: '22px',
                fill: '#000000',
                fontStyle: 'bold',
                stroke: '#ffffff',
                strokeThickness: 1,
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    color: '#ffffff',
                    blur: 2,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);
            optionContainer.add([optionBox, optionText]);
            optionContainer.setSize(600, 50);
            const pointerOver = () => {
                if (optionBox && optionBox.scene) {
                    optionBox.setFillStyle(0xff69b4, 0.2);
                }
                if (optionText && optionText.scene) {
                    optionText.setStyle({
                        fill: '#ff1493'
                    });
                }
            };
            const pointerOut = () => {
                if (optionBox && optionBox.scene) {
                    optionBox.setFillStyle(0xffffff, 0.8);
                }
                if (optionText && optionText.scene) {
                    optionText.setStyle({
                        fill: '#2c3e50'
                    });
                }
            };
            optionContainer
                .setInteractive({
                    useHandCursor: true
                })
                .on('pointerover', () => {
                    this.tweens.add({
                        targets: optionContainer,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 100
                    });
                    pointerOver();
                })
                .on('pointerout', () => {
                    this.tweens.add({
                        targets: optionContainer,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100
                    });
                    pointerOut();
                })
                .on('pointerover', pointerOver)
                .on('pointerout', pointerOut)
                .on('pointerdown', () => this.makeChoice(index));
            return optionText;
        });
    }
    updateTimer() {
        if (this.choiceTimer > 0) {
            this.choiceTimer--;
            if (this.timerText) {
                const color = this.choiceTimer <= 5 ? '#ff0000' : '#ffffff';
                this.timerText.setText(`Tempo: ${this.choiceTimer}s`).setColor(color);

                if (this.choiceTimer <= 5) {
                    this.tweens.add({
                        targets: this.timerText,
                        scale: 1.2,
                        duration: 200,
                        yoyo: true
                    });
                }
            }
        } else {
            // Time's up - make automatic negative choice
            this.makeChoice(-1);
        }
    }
    checkAchievements() {
        const currentTime = this.time.now;

        // First Choice Achievement
        if (!this.achievements.firstChoice && this.currentScenario === 0) {
            this.achievements.firstChoice = true;
            this.showAchievement('Primeira Escolha!', 'Você fez sua primeira decisão ética!');
        }
        // Perfect Score Achievement
        if (!this.achievements.perfectScore && this.score >= 150) {
            this.achievements.perfectScore = true;
            this.showAchievement('Mestre da Ética!', 'Você alcançou uma pontuação excelente!');
        }
        // Speed Runner Achievement
        if (this.choiceTimer > 10) {
            this.achievementProgress.fastChoices++;
            if (!this.achievements.speedRunner && this.achievementProgress.fastChoices >= 5) {
                this.achievements.speedRunner = true;
                this.showAchievement('Decisão Rápida!', 'Você fez 5 escolhas rápidas e corretas!');
            }
        }
        // Thoughtful Decision Maker Achievement
        if (this.choiceTimer <= 5) {
            if (!this.achievements.thoughtful && this.statistics.goodChoices >= 3) {
                this.achievements.thoughtful = true;
                this.showAchievement('Pensador Profundo!', 'Você toma decisões bem pensadas!');
            }
        }
    }
    showAchievement(title, description) {
        const achievementContainer = this.add.container(400, 100);

        const background = this.add.rectangle(0, 0, 400, 80, 0xffd700, 0.9);
        background.setStrokeStyle(2, 0x000000);

        const titleText = this.add.text(0, -15, title, {
            fontSize: '24px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const descText = this.add.text(0, 15, description, {
            fontSize: '18px',
            fill: '#000000'
        }).setOrigin(0.5);

        achievementContainer.add([background, titleText, descText]);
        achievementContainer.setAlpha(0);
        achievementContainer.setDepth(1000);
        // Animation
        this.tweens.add({
            targets: achievementContainer,
            alpha: 1,
            y: 150,
            duration: 1000,
            ease: 'Cubic.out',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: achievementContainer,
                        alpha: 0,
                        y: 100,
                        duration: 1000,
                        ease: 'Cubic.in',
                        onComplete: () => {
                            achievementContainer.destroy();
                        }
                    });
                });
            }
        });
    }
    updateProgressBar() {
        const progress = this.currentScenario / this.scenarios.length;
        this.progressBar.setScale(progress, 1);
    }
    createTransition(onComplete) {
        const transition = this.add.rectangle(400, 300, 800, 600, 0x000000);
        transition.alpha = 0;

        this.tweens.add({
            targets: transition,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                this.tweens.add({
                    targets: transition,
                    alpha: 0,
                    duration: 300,
                    delay: 100,
                    onComplete: () => {
                        transition.destroy();
                        if (onComplete) onComplete();
                    }
                });
            }
        });
    }

    makeChoice(choiceIndex) {
        // Calculate points based on difficulty
        const scenario = this.scenarios[this.currentScenario];
        const difficultyMultiplier = scenario.difficulty || 1;
        // Auto-save after each choice
        this.saveGame();
        // Stop the timer
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }
        const choice = choiceIndex >= 0 ? scenario.options[choiceIndex] : {
            points: -10,
            feedback: "Tempo esgotado! Tente responder mais rápido na próxima vez."
        };
        // Update statistics and play appropriate sound
        if (choice.points > 0) {
            this.statistics.goodChoices++;
        } else {
            this.statistics.badChoices++;
        }
        // Atualiza pontuação
        const earnedPoints = choice.points * difficultyMultiplier;
        this.score += earnedPoints;
        this.scoreText.setText('Pontos: ' + this.score);

        // Show difficulty indicator
        const difficultyText = this.add.text(700, 100, `Dificuldade: ${'⭐'.repeat(difficultyMultiplier)}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });

        // Fade out difficulty indicator
        this.tweens.add({
            targets: difficultyText,
            alpha: 0,
            duration: 2000,
            onComplete: () => difficultyText.destroy()
        });

        // Mostra feedback
        if (this.feedbackText) this.feedbackText.destroy();
        const feedbackColor = choice.points > 0 ? '#27ae60' : '#c0392b';
        const feedbackBox = this.add.rectangle(400, 500, 750, 120, feedbackColor, 0.3);
        feedbackBox.setStrokeStyle(4, feedbackColor);
        // Adiciona um brilho pulsante ao redor do feedback
        const glowGraphics = this.add.graphics();
        glowGraphics.lineStyle(8, feedbackColor, 0.4);
        glowGraphics.strokeRoundedRect(25, 440, 750, 120, 16);

        this.tweens.add({
            targets: glowGraphics,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Add feedback icon
        const iconX = 150;
        const feedbackIcon = choice.points > 0 ?
            this.add.circle(iconX, 500, 15, 0x27ae60) :
            this.add.rectangle(iconX, 500, 30, 30, 0xc0392b);
        this.feedbackText = this.add.text(400, 500, choice.feedback, {
            fontSize: '20px',
            fill: feedbackColor,
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                stroke: true,
                fill: true
            },
            backgroundColor: '#ffffff80',
            padding: {
                x: 15,
                y: 8
            }
        }).setOrigin(0.5);

        // Animação do player
        this.tweens.add({
            targets: this.player,
            y: choice.points > 0 ? 480 : 520,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                // Aguarda 2 segundos antes de mostrar próximo cenário
                this.time.delayedCall(2000, () => {
                    this.currentScenario++;
                    this.createTransition(() => {
                        this.showScenario();
                        this.updateProgressBar();
                    });
                });
            }
        });
    }
    showEndGame() {
        // Stop the timer if it's still running
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }

        // Hide timer text
        if (this.timerText) {
            this.timerText.destroy();
        }
        // Limpa elementos anteriores
        if (this.questionText && this.questionText.scene) {
            this.questionText.destroy();
        }
        if (this.optionContainers) {
            this.optionContainers.forEach(container => {
                if (container && container.scene) {
                    container.destroy();
                }
            });
        }
        if (this.feedbackText && this.feedbackText.scene) {
            this.feedbackText.destroy();
        }

        // Mensagem final baseada na pontuação
        // Calculate final statistics
        this.statistics.totalTime = Math.floor((this.time.now - this.startTime) / 1000);

        let finalMessage = '';
        if (this.score >= 100) {
            finalMessage = 'Parabéns! Você é um exemplo de cidadania!\n';
        } else if (this.score >= 0) {
            finalMessage = 'Bom trabalho! Mas você pode melhorar!\n';
        } else {
            finalMessage = 'Vamos refletir sobre nossas ações!\n';
        }

        finalMessage += `Pontuação final: ${this.score}\n`;
        finalMessage += `\nEstatísticas:\n`;
        finalMessage += `Boas escolhas: ${this.statistics.goodChoices}\n`;
        finalMessage += `Escolhas a melhorar: ${this.statistics.badChoices}\n`;
        finalMessage += `Tempo total: ${this.statistics.totalTime} segundos\n\n`;
        finalMessage += `Conquistas Desbloqueadas:\n`;

        // Add achievements summary
        const unlockedAchievements = Object.entries(this.achievements)
            .filter(([_, unlocked]) => unlocked)
            .map(([name, _]) => {
                switch (name) {
                    case 'firstChoice':
                        return 'Primeira Escolha';
                    case 'perfectScore':
                        return 'Mestre da Ética';
                    case 'speedRunner':
                        return 'Decisão Rápida';
                    case 'thoughtful':
                        return 'Pensador Profundo';
                    case 'consistent':
                        return 'Consistente';
                    default:
                        return name;
                }
            });

        if (unlockedAchievements.length > 0) {
            finalMessage += unlockedAchievements.join('\n');
        } else {
            finalMessage += 'Nenhuma conquista desbloqueada ainda!\nTente novamente para ganhar conquistas!';
        }

        const finalMessageBox = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width * 0.8, this.scale.height * 0.7, 0xffffff, 0.9);
        finalMessageBox.setStrokeStyle(2, 0xff69b4);

        this.add.text(400, 300, finalMessage, {
            fontSize: '26px',
            fill: '#2c3e50',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        // Enhanced restart button
        const buttonBox = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.8, this.scale.width * 0.3, this.scale.height * 0.1, 0x357abd, 0.8);
        const restartButton = this.add.text(this.scale.width / 2, this.scale.height * 0.8, 'Jogar Novamente', {
                fontSize: '22px',
                fill: '#ffffff',
                fontStyle: 'bold'
            })
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            })
            .on('pointerdown', () => {
                this.scene.restart();
                this.score = 0;
                this.currentScenario = 0;
            });
    }
    showStartScreen() {
        // Gradient background
        const background = this.add.graphics();
        background.fillGradientStyle(0xff69b4, 0xff69b4, 0xffc0cb, 0xffc0cb, 1);
        background.fillRect(0, 0, this.scale.width, this.scale.height);
        // Title
        const titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.25, 'Ética na Escola', {
            fontSize: '58px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#ff1493',
            strokeThickness: 8,
            shadow: {
                blur: 10,
                color: '#000000',
                fill: true
            }
        }).setOrigin(0.5);
        titleText.setShadow(2, 2, 'rgba(0,0,0,0.3)', 5);
        // Buttons container
        const buttonsContainer = this.add.container(400, 300);
        // New Game Button
        const newGameButton = this.createButton(0, 0, 'Novo Jogo', () => {
            this.gameStarted = true;
            this.scene.restart();
        });
        buttonsContainer.add([newGameButton]);
    }
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        // Enhanced button background
        // Enhanced button with better visual style
        const buttonBg = this.add.rectangle(0, 0, this.scale.width * 0.3, this.scale.height * 0.1, 0xff1493, 0.9);
        buttonBg.setStrokeStyle(4, 0xffffff);

        // Add shine effect
        const shine = this.add.rectangle(0, -50, this.scale.width * 0.3, 10, 0xffffff, 0.5);
        this.tweens.add({
            targets: shine,
            y: 50,
            alpha: {
                from: 0.5,
                to: 0
            },
            duration: 2000,
            repeat: -1
        });
        button.add(shine);
        buttonBg.setStrokeStyle(3, 0xffcc00);

        // Add button glow effect
        const glowGraphics = this.add.graphics();
        glowGraphics.lineStyle(4, 0xffcc00, 0.3);
        glowGraphics.strokeRoundedRect(-150, -30, 300, 60, 10);

        // Add pulsing animation to glow
        this.tweens.add({
            targets: glowGraphics,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        button.add(glowGraphics);
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '26px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                blur: 5,
                color: '#000000',
                fill: true
            }
        }).setOrigin(0.5);
        button.add([buttonBg, buttonText]);
        button.setSize(300, 60);
        button.setInteractive({
                useHandCursor: true
            })
            .on('pointerover', () => {
                buttonBg.setFillStyle(0xffb6c1, 0.8);
                this.tweens.add({
                    targets: button,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                buttonBg.setFillStyle(0xff69b4, 0.8);
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            })
            .on('pointerdown', callback);
        return button;
    }
}

const container = document.getElementById('renderDiv');
const config = {
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: '#ff69b4',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: SchoolEthicsGame
};
window.phaserGame = new Phaser.Game(config);

function resize() {
    const canvas = document.querySelector('canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = 800 / 600;

    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = (windowWidth / gameRatio) + 'px';
    } else {
        canvas.style.width = (windowHeight * gameRatio) + 'px';
        canvas.style.height = windowHeight + 'px';
    }

    if (container) {
        container.style.width = canvas.style.width;
        container.style.height = canvas.style.height;
    }
}
// Adiciona listener para redimensionamento
window.addEventListener('resize', () => {
    resize();
});
// Executa o resize inicial
window.addEventListener('load', () => {
    resize();
});
// Adiciona estilos CSS necessários
const style = document.createElement('style');
style.textContent = `
    #renderDiv {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    canvas {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    }
`;
document.head.appendChild(style);   