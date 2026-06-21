---
title: "Neural networks: from perceptrons to transformers"
transition: slide-left
mdc: true
---

<style>
@import "./style.css";
</style>

<div class="fac-title-slide">

# From perceptrons to transformers

## Part 1: The perceptron

</div>

<!--
Part one of the story: how a single artificial neuron learns to classify.
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
The story begins in 1943, when McCulloch and Pitts publish their seminal paper on the mathematics of the nervous system.
-->

---

# The basic model

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats/02-basic-model-letterbox.svg" alt="Two input signals enter a simple threshold unit and produce one output">

<p class="sample-caption">A weighted sum of inputs and a threshold function.</p>

<!--
With the basic components in place, their model could perform all logical functions, although it couldn't learn them.
-->

---

# "Neurons that fire together, wire together"

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats/03-hebb-fire-together.svg" alt="A connection between active units becomes stronger after experience">

<p class="sample-caption">The Organization of Behavior, 1949.</p>

<!--
Six years later, Hebb introduced the idea that connections in neurons might change through experience.
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
Then in 1958, Rosenblatt brings all these ideas together in an artificial neuron that uses labelled examples to learn a classification boundary.
-->

---

# The classification boundary

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/06-boundary-letterbox.svg" alt="Labelled points before and after adding one separating line">

<p class="sample-caption">The line separates two classes of input.</p>

<!--
The classification boundary determines the prediction.
-->

---

# Weights determine the slope

<img class="sample-boundary-visual sample-boundary-visual--raised" src="./assets/perceptrons/story-beats-v2/07-weights-slope-letterbox.svg" alt="The same points shown with two separating lines of different slopes">

<p class="sample-caption">Changing the weights rotates the boundary.</p>

<v-click>
<p class="sample-question sample-question--wide">If the slope is correct but the boundary is in the wrong place, what still needs to change?</p>
</v-click>

<!--
And changes the prediction for some of the data points.

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
And gets us closer to a correct prediction.

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
Depending on which side of the line a data point falls.

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
In this simple case, the error is just the expected value minus the prediction.

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
In the direction of the error.

Answer: No. The model usually needs repeated chances to improve the boundary.
-->

---

# Epochs are repeated passes

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/12-epochs-letterbox.svg" alt="The separating line improves over three repeated passes through the same data">

<p class="sample-caption">Repeated passes refine the boundary.</p>

<v-click>
<p class="sample-question">What would make another pass through the data pointless?</p>
</v-click>

<!--
Giving the model more chances to move the boundary and reduce the error.

Answer: When no straight boundary can separate the classes; the limitation is representational, not training time.
-->

---

# Linear classification has limits

<img class="sample-boundary-visual" src="./assets/perceptrons/story-beats-v2/13-linear-limit-letterbox.svg" alt="A single straight line cannot separate alternating classes">

<p class="sample-caption">A single straight line is too simple.</p>

<v-click>
<p class="sample-question">How could we overcome this limit?</p>
</v-click>

<!--
And more training will not solve the problem.

Answer: By combining simple activated units, so the model can build more complex boundaries.
-->

---

# Layers can handle more complexity

<img class="sample-boundary-visual" src="./assets/paper-fronts/rosenblatt-figure-1-organization-trimmed.png" alt="Rosenblatt's Figure 1, showing sensory, association and response layers in the perceptron">

<p class="sample-caption">From Rosenblatt's original paper.</p>

<!--
Rosenblatt's perceptron already included sensory, association and response layers that could combine to build more complex boundaries.
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
Rosenblatt even built a machine using a perceptron network that could recognise visual patterns, but effective training would have to wait until the 1980s.
-->

---

# What comes next

<div class="paper-citation-slide">
  <div class="paper-citation-image-crop">
    <img src="./assets/paper-fronts/transformers-2017.png" alt="Top of the first page of the Attention Is All You Need paper">
  </div>

  <div class="paper-citation-copy">
    <p class="paper-citation-title">Attention Is All You Need</p>
    <p class="paper-citation-meta">Vaswani et al. (2017)</p>
  </div>
</div>

<!--
Later breakthroughs solved more complex problems: backpropagation trains layers, CNNs reveal image structure, embeddings represent meaning, attention uses context, and transformers scale it.
-->
