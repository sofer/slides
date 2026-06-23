---
title: "Neural networks: from perceptrons to transformers"
transition: slide-left
mdc: true
---

<style>
@import "./style.css";
</style>

<div class="welcome-slide">

# Welcome :)

<div class="welcome-content">
  <img class="welcome-qr" src="./assets/workshop-qr.png" alt="Workshop materials QR code" />
  <img class="welcome-qr" src="./assets/discord-qr.png" alt="Discord QR code" />

  <div class="welcome-details">
    <p><strong>Wi-Fi</strong></p>
    <p>Name: FAC</p>
    <p>Pass:</p>
    <p>StochasticParrots27</p>
  </div>

  <p class="welcome-label">Materials</p>
  <p class="welcome-label">Discord</p>
  <p class="welcome-start"><strong>Starting at 14:10</strong></p>
</div>

</div>

<!--
Practical welcome slide. Replace the Wi-Fi pass and start time for the actual session.
-->

---

<div class="fac-title-slide">

# From perceptrons to transformers

## Part 1: The perceptron

</div>

<!--
Part one of the story: how a single artificial neuron learns to classify.
-->

---

<div class="image-only-slide">
  <img src="./assets/perceptrons/cold-open-letter-c.png" alt="A large white C on a dark background">
</div>

<!--
You can spot a C in a split second. No one can write the rule that separates every C from every other letter. Could a machine find the rule for itself?
-->

---

# Modelling the neuron

<div class="paper-citation-slide">
  <div class="paper-citation-image-crop">
    <img src="./assets/paper-fronts/mcculloch-pitts-1943.jpg" alt="Top of the first page of McCulloch and Pitts's 1943 logical calculus paper">
  </div>

  <div class="paper-citation-copy">
    <p class="paper-citation-title">A Logical Calculus of the Ideas Immanent in Nervous Activity</p>
    <p class="paper-citation-meta">Warren S. McCulloch and Walter Pitts (1943)</p>
  </div>
</div>

<!--
Their answer is almost insultingly simple: inputs, a sum, a threshold.
-->

---

# The basic model

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats/02-basic-model-letterbox.svg" alt="Two input signals enter a simple threshold unit and produce one output">

<p class="sample-caption">A weighted sum of inputs and a threshold function.</p>

<!--
It computes — it can't learn.
-->

---

# "Neurons that fire together, wire together"

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats/03-hebb-fire-together.svg" alt="A connection between active units becomes stronger after experience">

<p class="sample-caption">Donald Hebb, The Organization of Behavior, 1949.</p>

<!--
The weights are something experience can write to.
-->

---

# The perceptron

<div class="paper-citation-slide">
  <div class="paper-citation-image-crop">
    <img src="./assets/paper-fronts/rosenblatt-1958-trimmed.png" alt="Top of the first page of Rosenblatt's 1958 perceptron paper">
  </div>

  <div class="paper-citation-copy">
    <p class="paper-citation-title">The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain</p>
    <p class="paper-citation-meta">Frank Rosenblatt (1958)</p>
  </div>
</div>

<!--
It nudges its own weights until it finds the rule nobody wrote down.
-->

---

# The classification boundary

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/06-boundary-letterbox.svg" alt="Labelled points before and after adding one separating line">

<p class="sample-caption">The line separates two classes of input.</p>

<!--
Learning means finding where to put the line.
-->

---

# Weights determine the slope

<img class="sample-boundary-visual sample-boundary-visual--raised" src="./assets/perceptrons/story-beats-v2/07-weights-slope-letterbox.svg" alt="The same points shown with two separating lines of different slopes">

<p class="sample-caption">Changing the weights rotates the boundary.</p>

<v-click>
<p class="sample-question">If the slope is correct but the boundary is in the wrong place, what still needs to change?</p>
</v-click>

<!--
Weights are the angle of the decision.

Answer: The position of the boundary needs to move, without changing its slope.
-->

---

# Bias determines the threshold

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/08-bias-shift-letterbox.svg" alt="The same sloped boundary moves without changing its slope">

<p class="sample-caption">Changing the bias translates the boundary along its normal direction.</p>

<v-click>
<p class="sample-question">What's the final step?</p>
</v-click>

<!--
Weights for the angle, bias for the position.

Answer: The activation function.
-->

---

# Activation turns the score into a binary prediction

<div class="sample-formula">

$$\hat{y} = \begin{cases} 1 & \text{if } \; w \cdot x + b \ge 0 \\ 0 & \text{otherwise} \end{cases}$$

</div>

<p class="sample-caption">The perceptron predicts a score.</p>

<v-click>
<p class="sample-question">What are the possible predictions in this case?</p>
</v-click>

<!--
Now it's committed. Now it can be wrong.

Answer: 0 and 1.
-->

---

# The error is calculated

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/10-compare-label-letterbox.svg" alt="A predicted class is compared with an expected class">

<p class="sample-caption">Error = Expected - Prediction</p>

<v-click>
<p class="sample-question">In this case, what are the possible values of the error?</p>
</v-click>

<!--
That little number is the entire feedback signal.

Answer: -1, 0, 1.
-->

---

# The weights and bias are updated

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/11-error-update-letterbox.svg" alt="An error causes the separating line to move toward a better position">

<p class="sample-caption">The boundary shifts.</p>

<v-click>
<p class="sample-question">After one correction, should we expect the whole boundary to be fixed?</p>
</v-click>

<!--
One example, one nudge — not enough to fix everything.

Answer: No. One nudge only tells the machine about one mistake.
-->

---

# Epochs are repeated passes

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/12-epochs-letterbox.svg" alt="The separating line improves over three repeated passes through the same data">

<p class="sample-caption">Repeated passes refine the boundary.</p>

<v-click>
<p class="sample-question">What would make another pass through the data pointless?</p>
</v-click>

<!--
When there are no mistakes, there are no nudges.

Answer: When no straight boundary can separate the classes. The limitation is the shape, not the training time.
-->

---

# Linear classification has limits

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/13-linear-limit-letterbox.svg" alt="XOR truth table on the left; a scatter plot of the XOR inputs on the right showing no single line separates the alternating classes">

<p class="sample-caption">Classifying XOR.</p>

<v-click>
<p class="sample-question">How could we overcome this limit?</p>
</v-click>

<!--
It's not effort, it's the shape of what one line can represent.

Answer: By combining perceptrons into a network.
-->

---

# Layers can handle more complexity

<img class="sample-boundary-visual" src="./assets/paper-fronts/rosenblatt-figure-1-organization-trimmed.png" alt="Rosenblatt's Figure 1, showing sensory, association and response layers in the perceptron">

<p class="sample-caption">From Rosenblatt's original paper.</p>

<!--
The idea of depth was there in Rosenblatt's original design.
-->

---

# The perceptron was not just an idea

<div class="paper-citation-slide">
  <div class="paper-citation-image-crop">
    <img src="./assets/paper-fronts/mark-i-perceptron-us-navy.jpg" alt="Mark I Perceptron machine">
  </div>

  <div class="paper-citation-copy">
    <p class="paper-citation-title">Mark I Perceptron machine</p>
    <p class="paper-citation-meta">1960</p>
  </div>
</div>

<!--
Not a diagram. An actual room of wires and motors. It worked.
-->

---

# What came next

- Backpropagation (1986)
- Convolutional networks (1998)
- AlexNet and ImageNet (2012)
- Word embeddings (2013)
- Attention (2014)
- Transformers (2017)

<!--
We had to wait almost 30 years for a good solution to this problem, which was provided by the idea of backpropagation in 1986. A number of ground-breaking papers followed over the next thirty years, culminating in the "Attention Is All You Need" paper in 2017.
-->

---

# Whiteboard questions

1. Draw a perceptron: inputs, weights, bias, weighted sum, activation function, and prediction.
2. Draw a 2D classification problem: two feature axes, two classes, and a possible separating line.
3. On the boundary, show what changing the weights does and what changing the bias does.
4. Make an AND truth table, plot the four points, and draw a boundary.
5. Make an XOR truth table, plot the four points, and try to draw a single boundary. Why does it fail, and what fixes it?

<!--
Answers and facilitation notes in teaching-plan.md.
-->

---

<div class="get-into-it-slide">

# Let's get into it

<div style="display: flex; justify-content: center; margin-top: 8px;">
  <img src="./assets/workshop-qr.png" alt="Workshop materials QR code" class="get-into-it-qr" />
</div>

</div>

<!--
Hand-off slide: participants scan the QR to start the practical module.
-->

---

<div class="closing-centre closing-large">
  <p>One more thing...</p>
</div>

<!--
Transition from the workshop content into the wider programme and application close.
-->

---

<div class="get-into-it-slide">

# Let's get into it

<div class="get-into-it-content">
  <img src="./assets/workshop-qr.png" alt="Workshop materials QR code" class="get-into-it-qr" />
</div>

</div>

<!--
Move learners from slides and whiteboard into the platform module. Replace workshop-card.png with the perceptron module card.
-->

---

<div class="closing-programme">
  <img src="./assets/fac-brand/logo-horizontal-white-bg.svg" alt="Founders and Coders" class="closing-logo" />

  <h1>Machine Learning Apprenticeship</h1>

  <div class="closing-feature-grid">
    <div>52 in-person workshops <span>format</span></div>
    <div>Fully funded <span>funding</span></div>
    <div>Peer-led discussion every session <span>cohort</span></div>
    <div>Projects tied to real work <span>outcomes</span></div>
  </div>
</div>

<!--
Programme summary for open workshops where the apprenticeship is relevant.
-->

---

<div class="closing-programme closing-eligibility">
  <img src="./assets/fac-brand/logo-horizontal-white-bg.svg" alt="Founders and Coders" class="closing-logo" />

  <h1>Eligibility</h1>

  <div class="closing-feature-grid closing-eligibility-grid">
    <div>Employed or own company <span>employed</span></div>
    <div>Resident for 3+ years <span>residency</span></div>
  </div>
</div>

<!--
Eligibility for the apprenticeship.
-->

---

<div class="closing-apply">
  <img src="./assets/attention-closing/apply-qr.png" alt="Apply QR code" />
</div>

<!--
Final closing slide: application/signup close.
-->
